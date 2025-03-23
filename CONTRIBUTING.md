# Contributing to GraphQL-Project-Social-Network

Thank you for your interest in contributing to the GraphQL-Project-Social-Network! We welcome contributions from everyone to help build this social network platform. This document outlines how to contribute effectively.

## Getting Started

Before contributing, please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

### Prerequisites
- **Node.js**: Version 18.x or higher
- **pnpm**: Version 8.x or higher (our package manager)
- Familiarity with React, GraphQL, Prisma, and TypeScript

### Project Setup
1. **Clone the repository**:
    ```bash
    git clone git@github.com:Efrei-M1-DEV1/GraphQL-Project-Social-Network.git
    cd GraphQL-Project-Social-Network
    ```
2. **Install dependencies**:
    ```bash
    pnpm install
    ```
3. **Set up the database**:
    - Create `apps/server/.env` with `DATABASE_URL=file:./prisma/dev.db`
    - Run migrations: `cd apps/server && pnpm prisma migrate dev --name init`
4. **Start the servers**:
    - Backend: `cd apps/server && pnpm dev`
    - Frontend: `cd apps/web && pnpm dev`
    
Refer to the README (README.md) for detailed setup instructions.

## How to Contribute

### Reporting Bugs
- Open a GitHub issue with a clear title and description.
- Include steps to reproduce, expected behavior, and actual behavior.
- Add the `bug` label.

### Suggesting Features
- Open an issue with the `enhancement` label.
- Describe the feature, its purpose, and potential implementation ideas.

### Submitting Code Changes
1. **Fork the repository** and clone your fork:
    ```bash
    git clone git@github.com:<your-username>/GraphQL-Project-Social-Network.git
    ```
2. **Create a feature branch** from `develop`:
    ```bash
    git checkout develop
    git flow feature start <your-feature-name>
    ```
3. **Make changes**:
    - Follow TypeScript and Biome linting standards.
    - Update or add tests if applicable.
    - Keep changes focused and well-documented.
4. **Commit your changes**:
    - Use conventional commits (e.g., `feat: add feature`, `fix: resolve bug`).
    ```bash
    git commit -m "feat: describe your change" -m "Additional details here"
    ```
5. **Push your branch**:
    ```bash
    git push origin feature/<your-feature-name>
    ```
6. **Open a pull request**:
    - Target the `develop` branch.
    - Provide a clear title and description, linking to related issues (e.g., `Closes #<issue-number>`).
    - Request review from maintainers.

## Code Review Process

- Maintainers review pull requests and provide feedback within a few days.
- Address comments by pushing additional commits.
- Approved PRs are merged into `develop`.

## Project Structure

- `apps/server/`: GraphQL backend with Apollo Server and Prisma.
- `apps/web/`: React frontend with Vite and Apollo Client.
- `packages/*`: Shared utilities (e.g., `ui/`, `utils/`, `tailwind-config/`).

## Questions?

For help, open an issue or email [georgy.guei@efrei.net](mailto:georgy.guei@efrei.net). We’re excited to support you!
Thank you for contributing!
