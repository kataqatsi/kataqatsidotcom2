import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Navbar } from '../components/Navbar';

const CAL_NAMESPACE = '30min';
const CAL_LINK = 'kataqatsi/30min';

export function ContactPage() {
  useEffect(() => {
    void (async function () {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#777777' },
          dark: { 'cal-brand': '#ff8f00' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-[672px] px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Let&apos;s work together</h1>
        <p className="text-muted-foreground mb-6">
          Pick a time that works for you — calendar opens below.
        </p>
        <div className="w-full overflow-hidden rounded-lg border border-border bg-background">
          <div className="h-[min(88vh,920px)] min-h-[680px] w-full">
            <Cal
              namespace={CAL_NAMESPACE}
              calLink={CAL_LINK}
              className="!h-full !w-full [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
              config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
