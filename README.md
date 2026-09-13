# Northstar sample site

A small static website used to test [vizoalica](https://github.com/ehud-am/vizoalica) deployment,
deployed at <https://vizoalica-sample.pages.dev/>. This repository is dedicated to vizoalica
testing and is unrelated to any other project.

## Run locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Vizoalica integration

This site uses vizoalica's dynamic (CI/CD) integration path: `.github/workflows/deploy-website.yml`
calls vizoalica's reusable deployment workflow on every push to `main`, which deploys this site to
Cloudflare Pages along with the vizoalica configuration and token-issuing Pages Functions. All
per-deployment values (data source, project id, endpoint URLs) live only in this repository's
GitHub Actions variables/secrets and the Cloudflare Pages environment — never in committed source.

Each page loads `<script async src="/vizoalica-loader.js"></script>`, which fetches
`/vizoalica/config.json` at runtime rather than embedding any configuration inline.

See vizoalica's
[deployment workflow contract](https://github.com/ehud-am/vizoalica/blob/main/specs/011-quality-simplicity-release/contracts/deploy-workflow-contract.md)
for the full list of required repository variables and secrets.
