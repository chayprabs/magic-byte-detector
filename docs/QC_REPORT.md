# FileSniff QC Report (Section 25)

**Repo:** https://github.com/chayprabs/magic-byte-detector  
**Run:** 2026-05-31  
**Verdict:** QUALIFIED (code/product) — hosted deploy requires GitHub Pages enablement

## Summary

| Category | Status |
|----------|--------|
| Repo structure (hybrid) | PASS |
| Build / test / typecheck | PASS (91 unit tests) |
| E2E Playwright | PASS |
| Bundle ≤ 800 KB gz | PASS (~86 KB) |
| Browser sniff p95 ≤ 100 ms | PASS (acceptance test) |
| PRD A1 corpus (named fixtures) | PASS (56 formats) |
| PRD A2 polyglot | PASS |
| PRD A3 macro | PASS |
| Privacy 4 KB mode | PASS |
| Worker health / scan / batch | PASS (docker) |
| SEO sub-routes | PASS |
| Legal pages | PASS |

## Notes

- **libmagic-WASM:** Curated signature table + sliding-window polyglot detection; WASM can be added without changing API.
- **ssdeep:** Optional; installed in worker Docker image when build succeeds.
- **Lighthouse ≥ 95:** Run on deployed GitHub Pages URL after enablement.
