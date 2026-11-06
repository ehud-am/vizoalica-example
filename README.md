# Vizoalica demo

The demo site for [Vizoalica](https://github.com/ehud-am/vizoalica), the open-source, self-hosted,
cookieless, privacy-first web analytics that runs in your own Cloudflare account.

Live: <https://vizoalica-example.pages.dev> · Vizoalica website and docs: <https://vizoalica.dev>

Each Vizoalica feature has its own page with an interactive demo, the fields that get recorded, an
explanation, and a **How to integrate** popup showing what your website has to add:

| Page | Feature |
| --- | --- |
| `index.html` | Overview, feature map, and the install steps |
| `pageviews.html` | Page views and in-page navigation |
| `grouping.html` | Page grouping (`/orders/8841` → `/orders/:id`) |
| `campaigns.html` | UTM campaign labels |
| `actions.html` | Click actions, naming and ignoring controls |
| `rage-clicks.html` | Rage clicks |
| `events.html` | Custom events |
| `goals.html` | Goals (`thanks.html` is its page-view goal target) |
| `pixel.html` | No-script pixel |
| `exclude.html` | Excluding your own visits |
| `privacy.html` | Privacy defaults and consent |
| `ai.html` | Asking an AI assistant (MCP) |

The site is plain static HTML, CSS and JavaScript with no build step. `app.js` renders the shared
header, navigation and footer, and holds the demo logic.

> The demos re-implement Vizoalica's documented rules (page grouping, name cleaning, event
> validation and so on) in the browser so you can try them. They are illustrations: the real
> filtering is done by the Vizoalica SDK and backend. See the
> [Vizoalica documentation](https://github.com/ehud-am/vizoalica#documentation) for the authoritative
> behaviour.

## Run locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. Locally there is no Vizoalica backend, so the header badge reads
"SDK not loaded" and the demos run without sending anything. (The browser logs a harmless 404 for the
placeholder script described below.)

## Vizoalica integration and deployment

This site is measured by Vizoalica using its one-script-tag install, without signed tokens.

The committed pages contain a placeholder tag, `<script async src="/vizoalica-loader.js"></script>`.
On every push to `main` (or when run manually from the Actions tab),
`.github/workflows/deploy-website.yml` stages the site, replaces the placeholder with the real
Vizoalica script tag, and deploys it to Cloudflare Pages with Wrangler. The tag's values come from
GitHub Actions settings, so no endpoint or key is committed to this repository.

### Deploy your own copy

1. Fork or clone this repository.
2. In Vizoalica ([setup guide](https://github.com/ehud-am/vizoalica#deployment-in-four-steps)), add a
   website for your Pages address. Leave **Require a signed token** off.
3. Create a Cloudflare Pages project (for example `wrangler pages project create <name>`).
4. In the repository's **Settings → Secrets and variables → Actions**, add:

   | Kind | Name | Value |
   | --- | --- | --- |
   | Secret | `CF_API_TOKEN` | Cloudflare API token with **Cloudflare Pages: Edit** |
   | Secret | `CF_ACCOUNT_ID` | Your Cloudflare account id |
   | Secret | `VIZOALICA_INGEST_ENDPOINT` | Your backend's ingest URL, e.g. `https://<backend>/v1/events:batch` |
   | Secret | `VIZOALICA_WEBSITE_KEY` | The website key from the Vizoalica console |
   | Variable | `CF_PAGES_PROJECT` | The Pages project name |

5. Push to `main`, or run **Deploy website** from the Actions tab.

If the website requires signed tokens in Vizoalica, events are rejected. For that path use
Vizoalica's own [deploy workflow template](https://github.com/ehud-am/vizoalica/blob/main/examples/cloudflare-pages/deploy-workflow.yml)
instead.

## Contributing

Pages are hand-edited HTML. When changing a demo, keep its payloads and rules in line with the
Vizoalica docs and do not invent fields. See [CLAUDE.md](CLAUDE.md) for the project conventions.

## License

[MIT](LICENSE)
