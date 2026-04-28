import { DemoApp } from '@/components/DemoApp';
import { AboutFooter } from '@/components/AboutFooter';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[640px] flex-col gap-10 px-6 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          The pause before a regrettable send.
        </h1>
        <p className="text-lg text-ink-soft">
          Paste a draft. See what the wisdom-frame would say before your AI agent
          sends it.
        </p>
      </header>
      <DemoApp />
      <AboutFooter />
    </main>
  );
}
