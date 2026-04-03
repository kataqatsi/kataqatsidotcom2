import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MessageCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import {
  fetchPublishedIssues,
  type GithubIssueIdea,
} from '../lib/github-ideas';

const RECENT_IDEAS_COUNT = 5;

export function HomePage() {
  const [recentIdeas, setRecentIdeas] = useState<GithubIssueIdea[] | null>(null);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedIssues(RECENT_IDEAS_COUNT)
      .then((data) => {
        if (!cancelled) {
          setRecentIdeas(data);
          setRecentError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setRecentError(
            e instanceof Error ? e.message : 'Could not load recent content.',
          );
          setRecentIdeas(null);
        }
      })
      .finally(() => {
        if (!cancelled) setRecentLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <main className="mx-auto w-full max-w-[672px] px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-muted-foreground italic mb-4">
              ( Hello )
            </h3>
            <h2 className="text-2xl mb-4">
              I'm <b>David</b>.
            </h2>
            <p className="text-lg mb-4">
              I develop simple software to solve complex problems.
            </p>

            <Button variant="outline" size="sm" asChild>
              <Link to="/contact" className="gap-1">
                Let&apos;s work together <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link to="/about" className="gap-1 ml-4">
                About me <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-xl font-bold text-muted-foreground italic mb-4">
            ( Recent content )
          </h3>
          {recentLoading && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Loading…
            </p>
          )}
          {recentError && !recentLoading && (
            <p className="text-sm text-muted-foreground">{recentError}</p>
          )}
          {!recentLoading && !recentError && recentIdeas && recentIdeas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No published ideas yet.{' '}
              <Link to="/ideas" className="text-foreground underline underline-offset-4">
                Ideas
              </Link>
            </p>
          )}
          {!recentLoading && !recentError && recentIdeas && recentIdeas.length > 0 && (
            <>
              <ul className="space-y-2 border-t border-border pt-2">
                {recentIdeas.map((issue) => (
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
              <p className="mt-4">
                <Link
                  to="/ideas"
                  className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  View all ideas
                </Link>
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
} 