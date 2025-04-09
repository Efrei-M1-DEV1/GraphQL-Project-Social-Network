# Security Policy

## Supported Versions

The GraphQL-Project-Social-Network is currently in active development. Security updates are applied to the `develop` branch, which serves as the mainline for ongoing work. Once the project reaches a stable release (e.g., v1.0.0), we’ll specify which versions receive security updates here.

| Version | Supported          |
|---------|--------------------|
| develop | :white_check_mark: |
| < 1.0.0 | :x: (pre-release)  |

## Reporting a Vulnerability

We take security seriously and appreciate your help in keeping this project safe. If you discover a security vulnerability, please report it responsibly by following these steps:

1. **Do not open a public issue**: Avoid disclosing vulnerabilities publicly until they’re resolved.
2. **Email us directly**: Send a detailed report to [georgy.guei@efrei.net](mailto:georgy.guei@efrei.net).
   - Include a description of the vulnerability.
   - Provide steps to reproduce it, if possible.
   - Mention any potential impact (e.g., data exposure, unauthorized access).
3. **Expect a response**: We’ll acknowledge your report within 48 hours and work with you to assess and address the issue.
4. **Resolution timeline**: We aim to resolve critical vulnerabilities within 7 days and less severe ones within 30 days, depending on complexity.

## Disclosure Process
- After verification, we’ll collaborate with you to fix the issue in a feature branch.
- Once resolved, the fix will be merged into `develop` and credited to you (if desired) in the commit message or release notes.
- We’ll coordinate with you on when and how to disclose the vulnerability publicly, ensuring safety for all users.

## Security Best Practices
Contributors are encouraged to:
- Keep dependencies updated (via `pnpm update`).
- Avoid committing sensitive data (e.g., API keys, passwords) to the repository.
- Follow secure coding practices outlined in [CONTRIBUTING.md](CONTRIBUTING.md).

Thank you for helping us maintain a secure project!
