import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import {
  fetchPublishedIssues,
  type GithubIssueIdea,
} from '../lib/github-ideas';

export function IdeasPage() {
  const [issues, setIssues] = useState<GithubIssueIdea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedIssues()
      .then((data) => {
        if (!cancelled) {
          setIssues(data);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load ideas.');
          setIssues(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-[672px] px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-bold text-muted-foreground italic mb-4">
          ( Ideas )
        </h3>

        {loading && (
          <p className="text-muted-foreground" aria-live="polite">
            Loading…
          </p>
        )}

        {error && !loading && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && issues && issues.length === 0 && (
          <p className="text-muted-foreground">
            No issues with the Published label yet.
          </p>
        )}

        {!loading && !error && issues && issues.length > 0 && (
          <ul className="space-y-2 border-t border-border pt-2">
            {issues.map((issue) => (
              <li key={issue.id}>
                <Link
                  to={`/ideas/${issue.number}`}
                  className="flex items-center justify-between gap-3 rounded-md px-1 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="min-w-0 flex-1">{issue.title}</span>
                  <span
                    className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground"
                    aria-label={`${issue.comments} comment${issue.comments === 1 ? '' : 's'}`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                    {issue.comments}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
