# bodhisattva-web

> Paste a draft. See what the wisdom-frame would say.

A 60-second hosted demo of [bodhisattva-mcp](https://github.com/rogercollell/bodhisattva-mcp) — the MCP server that pauses AI before it sends an email you'll regret.

This is an awareness funnel, not a product. To use the wisdom-frame on real sends, install bodhisattva-mcp locally.

## Local development

```bash
npm install
vercel env pull .env.local   # requires `vercel link` first
npm run dev
```

Open `http://localhost:3000`.

## Stack

- Next.js (App Router), TypeScript, Tailwind v4
- Vercel AI SDK + Vercel AI Gateway (Anthropic Haiku 4.5, OIDC auth)
- Upstash Redis sliding-window rate limit (5/IP/24h)
- vitest for unit tests

## Source-of-truth for the wisdom-frame prompt

The wisdom-frame and revision prompts in `lib/prompts.ts` are hand-ported from [bodhisattva-mcp](https://github.com/rogercollell/bodhisattva-mcp). See [`SYNC.md`](./SYNC.md).

## License

MIT.
