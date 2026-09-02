# Vizoalica sample site

A small static demo site for `test.gitlocal.com`, built to exercise Vizoalica page views and custom events.

## Run locally

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Connect Vizoalica

Set this before `app.js` in each page (or inject it from the hosting environment):

```html
<script>
  window.VIZOALICA_CONFIG = {
    scriptUrl: 'https://analytics.example.com/vizoalica.js',
    endpoint: 'https://analytics.example.com/v1/events:batch',
    source: 'test_gitlocal',
    project: 'northstar-demo',
    tokenUrl: '/vizoalica/ingest-token',
    consent: 'analytics-granted'
  };
</script>
```

The demo records custom events for signup entry points, library filters, billing selection, and plan selection. When no configuration is supplied it works as a normal static website and sends no analytics.
