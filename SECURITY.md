# Security Policy

## Reporting

Please report vulnerabilities via [GitHub Security Advisories](https://github.com/chayprabs/magic-byte-detector/security/advisories) or a private issue if you prefer.

## Scope

- Browser sniff engine (`packages/core`)
- Web app (`packages/web`)
- Worker API (`apps/worker`)

We do not log file contents. Worker uploads are processed ephemerally.

## Safe use

FileSniff is not antivirus software. Do not open untrusted files solely because FileSniff did not flag them.
