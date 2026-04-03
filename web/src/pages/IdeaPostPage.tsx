import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { IdeaMarkdown } from '../components/IdeaMarkdown';
import {
  fetchIssueComments,
  fetchPublishedIssueByNumber,
  type GithubCommentReactions,
  type GithubIssueComment,
  type GithubIssueIdea,
} from '../lib/github-ideas';

const COMMENT_REACTION_DISPLAY = [
  { key: '+1' as const, emoji: '👍', label: 'Thumbs up' },
  { key: '-1' as const, emoji: '👎', label: 'Thumbs down' },
  { key: 'laugh' as const, emoji: '😄', label: 'Laugh' },
  { key: 'confused' as const, emoji: '😕', label: 'Confused' },
  { key: 'heart' as const, emoji: '❤️', label: 'Heart' },
  { key: 'hooray' as const, emoji: '🎉', label: 'Hooray' },
  { key: 'rocket' as const, emoji: '🚀', label: 'Rocket' },
  { key: 'eyes' as const, emoji: '👀', label: 'Eyes' },
] as const;

function CommentReactionsBar({
  reactions,
}: {
  reactions: GithubCommentReactions;
}) {
  if (reactions.total_count <= 0) return null;
  const chips = COMMENT_REACTION_DISPLAY.filter(
    (r) => reactions[r.key] > 0,
  );
  if (chips.length === 0) return null;
  return (
    <div
      className="mt-3 flex flex-wrap gap-2"
      role="group"
      aria-label="Reactions on this comment (from GitHub)"
    >
      {chips.map(({ key, emoji, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
          title={`${label}: ${reactions[key]}`}
        >
          <span className="text-base leading-none" aria-hidden>
            {emoji}
          </span>
          <span>{reactions[key]}</span>
        </span>
      ))}
    </div>
  );
}

function formatCommentDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function IdeaPostPage() {
  const { issueNumber: issueParam } = useParams<{ issueNumber: string }>();
  const issueNumber = issueParam ? Number.parseInt(issueParam, 10) : NaN;
  const invalidNumber = !Number.isFinite(issueNumber) || issueNumber < 1;

  const [issue, setIssue] = useState<GithubIssueIdea | null>(null);
  const [loading, setLoading] = useState(!invalidNumber);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<GithubIssueComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  useEffect(() => {
    if (invalidNumber) {
      setIssue(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPublishedIssueByNumber(issueNumber)
      .then((data) => {
        if (!cancelled) {
          setIssue(data);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load post.');
          setIssue(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [issueNumber, invalidNumber]);

  useEffect(() => {
    if (!issue) {
      setComments([]);
      setCommentsError(null);
      setCommentsLoading(false);
      return;
    }

    let cancelled = false;
    setCommentsLoading(true);
    setCommentsError(null);

    fetchIssueComments(issue.number)
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setComments([]);
          setCommentsError(
            e instanceof Error ? e.message : 'Failed to load comments.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setCommentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [issue]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-[672px] px-4 sm:px-6 lg:px-8 py-12">
        <p className="mb-6">
          <Link
            to="/ideas"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Ideas
          </Link>
        </p>

        {invalidNumber && (
          <p className="text-destructive text-sm" role="alert">
            Invalid issue link.
          </p>
        )}

        {!invalidNumber && loading && (
          <p className="text-muted-foreground" aria-live="polite">
            Loading…
          </p>
        )}

        {!invalidNumber && !loading && error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        {!invalidNumber && !loading && !error && issue === null && (
          <p className="text-muted-foreground">
            This post doesn&apos;t exist or isn&apos;t published.
          </p>
        )}

        {!invalidNumber && !loading && !error && issue && (
          <>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-foreground pr-4">
                {issue.title}
              </h1>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Open on GitHub
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
            <IdeaMarkdown
              text={issue.body}
              className="text-base text-muted-foreground [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_p]:last:mb-0 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
            />
<section className="mt-2 border-t border-border pt-8">
            <Button variant="outline" size="sm" asChild>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Comment on GitHub
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            </section>

            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Discussion
              </h2>
              {commentsLoading && (
                <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
                  Loading comments…
                </p>
              )}
              {commentsError && !commentsLoading && (
                <p className="text-sm text-muted-foreground mb-4" role="status">
                  {commentsError}
                </p>
              )}
              {!commentsLoading && !commentsError && comments.length === 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  No comments yet.
                </p>
              )}
              {!commentsLoading && comments.length > 0 && (
                <ul className="mb-8 space-y-6">
                  {comments.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-lg border border-border bg-card/50 px-4 py-3"
                    >
                      <div className="mb-3 flex gap-3">
                        <a
                          href={c.user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                          aria-label={`${c.user.login} on GitHub`}
                        >
                          <img
                            src={c.user.avatar_url}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full ring-1 ring-border"
                          />
                        </a>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <a
                              href={c.user.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-foreground hover:underline"
                            >
                              {c.user.login}
                            </a>
                            <time
                              dateTime={c.created_at}
                              className="text-xs text-muted-foreground"
                            >
                              {formatCommentDate(c.created_at)}
                            </time>
                          </div>
                          <a
                            href={c.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                          >
                            View on GitHub
                          </a>
                        </div>
                      </div>
                      <IdeaMarkdown
                        text={c.body || '_No content._'}
                        className="text-sm text-muted-foreground [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_p]:mb-2 [&_p]:last:mb-0 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:text-xs"
                      />
                      <CommentReactionsBar reactions={c.reactions} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-2 border-t border-border pt-8">
            <Button variant="outline" size="sm" asChild>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Comment on GitHub
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
