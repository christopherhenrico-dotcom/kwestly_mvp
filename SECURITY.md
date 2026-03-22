# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this proprietary software, please report it to: **christopherhenrico@email.com**

**Do NOT** disclose security issues publicly until a fix is available.

## Security Best Practices

When deploying this software:
- Store all API keys and secrets in environment variables or secure secret management systems
- Never commit `.env` files or any file containing credentials to version control
- Use GitHub Secrets or similar for CI/CD sensitive data
- Rotate API keys regularly
- Use HTTPS for all production connections
