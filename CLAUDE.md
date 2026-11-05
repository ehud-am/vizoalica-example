# Project constitution

This repository is the public demo site for [Vizoalica](https://github.com/ehud-am/vizoalica).
It is maintained by **ehud-am**.

## Attribution

- All commits and pull requests are attributed to **ehud-am** alone.
- Never add `Co-Authored-By` trailers, "Generated with Claude Code" lines, or any other mention of
  an AI assistant to commit messages, pull request titles or descriptions, or code comments.
- Do not change the git author or committer identity; use the one already configured for the user.

## Public repository hygiene

- No personal information: no email addresses (other than the GitHub noreply address that git
  already uses), local paths, hostnames, or real names of people.
- No secrets, tokens, keys, account ids, or deployment-specific values in committed files. These
  live only in GitHub Actions variables/secrets and the Cloudflare Pages environment.
- The license is MIT (see `LICENSE`).

## Site rules

- Plain static HTML, CSS, and JavaScript. No build step: the deploy workflow publishes the repository root.
- Every page loads `<script async src="/vizoalica-loader.js"></script>` and nothing else from Vizoalica.
  Configuration is fetched at runtime and never embedded in source.
- Each Vizoalica feature gets its own page with a payload example, an explanation, and an
  "Integration" popup that shows what the website has to add.
- Payloads and rules shown on the pages must match the Vizoalica docs. Do not invent fields.
