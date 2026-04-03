const PUBLISHED_LABEL = 'Published';

export type GithubIssueIdea = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  /** Total issue comments (GitHub `comments` field). */
  comments: number;
};

/** Reaction counts from GitHub issue comments (same as on github.com). */
export type GithubCommentReactions = {
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  confused: number;
  heart: number;
  hooray: number;
  rocket: number;
  eyes: number;
};

export type GithubIssueComment = {
  id: number;
  body: string;
  created_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  reactions: GithubCommentReactions;
};

export function resolveIdeasRepo(): { owner: string; repo: string } | null {
  const combined = import.meta.env.VITE_GITHUB_IDEAS_REPO?.trim();
  if (combined?.includes('/')) {
    const [owner, repo] = combined.split('/');
    if (owner && repo) {
      return { owner, repo: repo.replace(/\.git$/, '') };
    }
  }
  const cms = import.meta.env.VITE_GITHUB_CMS_REPO?.trim();
  if (cms) {
    const m = cms.match(/github\.com\/([^/]+)\/([^/#?]+)/);
    if (m) {
      return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
    }
  }
  return null;
}

export async function fetchPublishedIssues(
  limit?: number,
): Promise<GithubIssueIdea[]> {
  const parsed = resolveIdeasRepo();
  if (!parsed) {
    throw new Error(
      'Set VITE_GITHUB_IDEAS_REPO (owner/repo) or VITE_GITHUB_CMS_REPO in .env',
    );
  }
  const { owner, repo } = parsed;
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
  );
  url.searchParams.set('labels', PUBLISHED_LABEL);
  url.searchParams.set('state', 'all');
  url.searchParams.set('sort', 'created');
  url.searchParams.set('direction', 'desc');
  const perPage =
    limit != null ? Math.min(Math.max(limit, 1), 100) : 50;
  url.searchParams.set('per_page', String(perPage));

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error (${res.status}). ${text.slice(0, 160)}${text.length > 160 ? '…' : ''}`,
    );
  }

  const data = (await res.json()) as Array<{
    id: number;
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    comments: number;
    pull_request?: unknown;
  }>;

  return data
    .filter((item) => !item.pull_request)
    .map((item) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      body: item.body,
      html_url: item.html_url,
      comments: item.comments ?? 0,
    }));
}

export async function fetchPublishedIssueByNumber(
  issueNumber: number,
): Promise<GithubIssueIdea | null> {
  const parsed = resolveIdeasRepo();
  if (!parsed) {
    throw new Error(
      'Set VITE_GITHUB_IDEAS_REPO (owner/repo) or VITE_GITHUB_CMS_REPO in .env',
    );
  }
  const { owner, repo } = parsed;
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error (${res.status}). ${text.slice(0, 160)}${text.length > 160 ? '…' : ''}`,
    );
  }

  const item = (await res.json()) as {
    id: number;
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    comments: number;
    pull_request?: unknown;
    labels?: Array<{ name: string }>;
  };

  if (item.pull_request) {
    return null;
  }

  const hasPublishedLabel =
    Array.isArray(item.labels) &&
    item.labels.some((l) => l.name === PUBLISHED_LABEL);

  if (!hasPublishedLabel) {
    return null;
  }

  return {
    id: item.id,
    number: item.number,
    title: item.title,
    body: item.body,
    html_url: item.html_url,
    comments: item.comments ?? 0,
  };
}

export async function fetchIssueComments(
  issueNumber: number,
): Promise<GithubIssueComment[]> {
  const parsed = resolveIdeasRepo();
  if (!parsed) {
    throw new Error(
      'Set VITE_GITHUB_IDEAS_REPO (owner/repo) or VITE_GITHUB_CMS_REPO in .env',
    );
  }
  const { owner, repo } = parsed;
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
  );
  url.searchParams.set('per_page', '100');

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error (${res.status}). ${text.slice(0, 160)}${text.length > 160 ? '…' : ''}`,
    );
  }

  const data = (await res.json()) as Array<{
    id: number;
    body: string;
    created_at: string;
    html_url: string;
    user: {
      login: string;
      avatar_url: string;
      html_url: string;
    };
    reactions?: Record<string, number>;
  }>;

  return data.map((c) => ({
    id: c.id,
    body: c.body,
    created_at: c.created_at,
    html_url: c.html_url,
    user: {
      login: c.user.login,
      avatar_url: c.user.avatar_url,
      html_url: c.user.html_url,
    },
    reactions: normalizeCommentReactions(c.reactions),
  }));
}

function normalizeCommentReactions(
  raw: Record<string, number> | undefined,
): GithubCommentReactions {
  if (!raw || typeof raw !== 'object') {
    return emptyReactions();
  }
  return {
    total_count: raw.total_count ?? 0,
    '+1': raw['+1'] ?? 0,
    '-1': raw['-1'] ?? 0,
    laugh: raw.laugh ?? 0,
    confused: raw.confused ?? 0,
    heart: raw.heart ?? 0,
    hooray: raw.hooray ?? 0,
    rocket: raw.rocket ?? 0,
    eyes: raw.eyes ?? 0,
  };
}

function emptyReactions(): GithubCommentReactions {
  return {
    total_count: 0,
    '+1': 0,
    '-1': 0,
    laugh: 0,
    confused: 0,
    heart: 0,
    hooray: 0,
    rocket: 0,
    eyes: 0,
  };
}
