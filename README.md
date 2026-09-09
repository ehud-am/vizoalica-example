# Northstar sample site

A small static website deployed at <https://vizoalica-sample-test-gitlocal-dev.pages.dev/>.

## Run locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Vizoalica snippet

```html
<script
  async
  src="https://vizoalica-sample-test-gitlocal-dev.pages.dev/vizoalica.js"
  data-endpoint="https://vizoalica-ingest-test-gitlocal-dev.ezborgy.workers.dev/v1/events:batch"
  data-source="26cca79d-34a5-422e-b492-59b761df1062"
  data-project="29335878-6d62-4461-a306-2dca996523ca"
  data-token-url="/vizoalica/ingest-token"
  data-consent="analytics-granted"
></script>
```
