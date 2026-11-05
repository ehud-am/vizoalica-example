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

This site uses Vizoalica's dynamic (CI/CD) integration path. `.github/workflows/deploy-website.yml`
calls Vizoalica's reusable deployment workflow on every push to `main`, which deploys the site to
Cloudflare Pages together with the Vizoalica configuration and token-issuing Pages Functions. All
per-deployment values live only in GitHub Actions variables/secrets and the Cloudflare Pages
environment, never in committed source.

Every page loads `<script async src="/vizoalica-loader.js"></script>`, which fetches
`/vizoalica/config.json` at runtime.

See the [deployment workflow contract](https://github.com/ehud-am/vizoalica/blob/main/specs/011-quality-simplicity-release/contracts/deploy-workflow-contract.md)
for the required repository variables and secrets.

## License

[MIT](LICENSE)
