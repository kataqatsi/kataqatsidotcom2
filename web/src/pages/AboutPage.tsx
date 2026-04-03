import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';

const profileImageSrc =
  import.meta.env.VITE_PROFILE_IMAGE_URL || '/pp.jpg';

const previousWork: {
  company: string;
  role: string;
  accomplishment: string;
}[] = [
  {
    company: 'Truthkeep.ai',
    role: 'AI Engineer / AI Consultant',
    accomplishment: 'Won contract with Microchip, Onsemi, and other big companies',
  },
  {
    company: 'Morph.so',
    role: 'Member of Technical Staff',
    accomplishment: 'Built infra for many AI startups including DevinAI',
  },
  {
    company: 'Involio',
    role: 'CTO / Founding Engineer',
    accomplishment: 'Scaled from 0 to 300k+ users',
  },
  {
    company: 'Best Western',
    role: 'Senior Software Engineer',
    accomplishment: 'Migrated on-prem call center to AWS',
  },
  {
    company: 'Ziff Davis',
    role: 'DevOps Engineer',
    accomplishment: 'Automated deployment pipeline',
  },
  {
    company: 'Terralogic',
    role: 'Software Engineer',
    accomplishment: 'Sped up release cycle from 3 hours to 15 minutes',
  },
  {
    company: 'USAF',
    role: 'Avionics Specialist (HH-60G)',
    accomplishment: 'That others may live',
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-[672px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 w-full sm:flex-1">
            <h3 className="text-xl font-bold text-muted-foreground italic mb-4">
              ( About )
            </h3>
            <h1 className="text-2xl font-bold text-foreground mb-4">David Anderson</h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              I develop simple software to solve complex problems. Here&apos;s where I&apos;ve
              contributed before - building products, platforms, and teams across startups and
              larger orgs.
            </p>
            <div className="mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/contact" className="gap-1">
                  Let&apos;s work together <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <img
            src={profileImageSrc}
            alt="David"
            width={144}
            height={144}
            className="h-32 w-32 shrink-0 rounded-full object-cover ring-2 ring-border sm:h-36 sm:w-36"
          />
        </div>

        <h3 className="text-xl font-bold text-muted-foreground italic mb-6">
          ( Previous work )
        </h3>
        <ul className="space-y-3">
          {previousWork.map(({ company, role, accomplishment }) => (
            <li
              key={company}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <p className="font-semibold text-foreground">{company}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Biggest accomplishment
                </p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {accomplishment.trim() ? accomplishment : '—'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
