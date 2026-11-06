# Vizoalica demo

The live demo site for [Vizoalica](https://github.com/ehud-am/vizoalica), the self-hosted,
cookieless, privacy-first web analytics that runs in your own Cloudflare account.

Each Vizoalica feature has its own page with an interactive demo, the fields that get recorded,
an explanation, and an **Integration** popup showing what your website has to add:

| Page | Feature |
| --- | --- |
| `pageviews.html` | Page views and in-page navigation |
| `grouping.html` | Page grouping (`/orders/8841` → `/orders/:id`) |
| `campaigns.html` | UTM campaign labels |
| `actions.html` | Click actions, naming and ignoring controls |
| `rage-clicks.html` | Rage clicks |
| `events.html` | Custom events |
| `goals.html` | Goals |
| `pixel.html` | No-script pixel |
| `exclude.html` | Excluding your own visits |
| `privacy.html` | Privacy defaults and consent |
| `ai.html` | Asking an AI assistant (MCP) |

## Run locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. Locally the Vizoalica SDK is not configured, so the header badge says
so and the demos run without sending anything.

## Vizoalica integration

Vizoalica's one-script-tag install is used, with no signed tokens. The committed pages contain a
placeholder tag, `<script async src="/vizoalica-loader.js"></script>`. On every push to `main`,
`.github/workflows/deploy-website.yml` stages the site, replaces the placeholder with the real
Vizoalica tag and deploys to Cloudflare Pages. The tag's values come from GitHub Actions secrets,
so nothing deployment-specific is committed:

| Kind | Name | Purpose |
| --- | --- | --- |
| Secret | `CF_API_TOKEN` | Cloudflare token with Pages: Edit |
| Secret | `CF_ACCOUNT_ID` | Cloudflare account |
| Secret | `VIZOALICA_INGEST_ENDPOINT` | Backend ingest URL, e.g. `https://<backend>/v1/events:batch` |
| Secret | `VIZOALICA_WEBSITE_KEY` | The website key from the Vizoalica console |
| Variable | `CF_PAGES_PROJECT` | Cloudflare Pages project name |

The website must not require signed tokens in the Vizoalica console. Run locally, the placeholder
does nothing and the header badge says the SDK is not loaded.

## License

[MIT](LICENSE)
