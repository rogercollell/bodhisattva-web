export function AboutFooter() {
  return (
    <footer className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-ink-soft">
      <p>
        <strong className="text-ink">About this demo.</strong> Your draft is sent
        to Anthropic via Vercel AI Gateway (zero data retention) for one framing
        call, then discarded. The server keeps an IP-based counter for rate
        limiting; it never stores draft or context content. Source code:{' '}
        <a
          className="underline hover:text-ink"
          href="https://github.com/rogercollell/bodhisattva-web"
        >
          github.com/rogercollell/bodhisattva-web
        </a>
        .
      </p>
    </footer>
  );
}
