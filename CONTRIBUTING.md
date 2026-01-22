# Contributing to GUARDIAN

Thanks for wanting to help out! Here's how to get started.

## setup

1. Fork the repo
2. Clone your fork
3. Run the setup script:
   ```bash
   # linux/mac
   ./scripts/setup.sh
   
   # windows
   .\scripts\setup.ps1
   ```

## development workflow

1. Create a branch for your feature/fix
2. Make your changes
3. Run tests:
   ```bash
   # backend
   cd backend && npm test
   
   # ml-audit
   cd ml-audit && pytest
   ```
4. Push and open a merge request

## code style

- **Backend**: TypeScript, follow existing patterns
- **ML Service**: Python, use type hints where possible
- **Frontend**: Vanilla JS, no frameworks

## commit messages

Keep them short and descriptive:
- `fix: handle null audit results`
- `feat: add batch model upload`
- `docs: update api examples`

## reporting bugs

Open an issue with:
- What you expected
- What actually happened
- Steps to reproduce
- Your environment (OS, node version, etc)

## questions?

Open an issue or reach out to the maintainers.
