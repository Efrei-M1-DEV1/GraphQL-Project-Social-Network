# Social Network Platform

This is a social network web application where users can register, post articles, comment on others' posts, and like articles. It's built using modern technologies like React, GraphQL, and Prisma, and is currently under active development.

## Features

- **User Registration and Authentication**:
  - Fully implemented with JWT-based login and registration.
  - Password hashing with `bcrypt` and input validation using `zod`.
- **Article Posting and Management**:
  - Queries (`articles`, `article(id)`, `articlesByAuthor`) implemented with pagination.
  - Mutations (create, update, delete) in progress, pending merge.
- **Commenting on Articles**:
  - Planned, not yet implemented.
- **Liking Articles**:
  - Planned, not yet implemented.
- **Development Mode Enhancements**:
  - Simulated resolver delay added for testing purposes in development environments. This simulates network latency to better test the application's responsiveness.

## Tech Stack

- **Frontend**: React, React Router, Redux Toolkit, Apollo Client, TypeScript, TailwindCSS, Vite
- **Backend**: Apollo Server, Prisma (with SQLite), GraphQL Codegen
- **Monorepo Management**: Turborepo with pnpm workspaces
- **Validation**: Zod for type-safe input validation
- **Utilities**: Shared in `packages/utils` (ES Modules)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Efrei-M1-DEV1/GraphQL-Project-Social-Network.git
   cd GraphQL-Project-Social-Network
   ```

---

2. **Install dependencies:**

   - Ensure that **Node.js** is installed by running:

     ```bash
     node -v
     ```

     If Node.js is not installed, download and install it from [nodejs.org](https://nodejs.org/).

   - Install **pnpm** globally (if not already installed):

     ```bash
     npm i -g pnpm
     ```

     Verify the installation by running:

     ```bash
     pnpm -v
     ```

   - Install dependencies for the entire monorepo (covers `apps/*` and `packages/*`):

     ```bash
     pnpm install
     ```

     > ***Important:** This project uses `pnpm` as the package manager, as specified in `pnpm-workspace.yaml`.*

---

3. **Set up the database and environment variables:**

#### ✅ For macOS/Linux (bash/zsh)

- Create a `.env` file in `apps/server/` with:
  ```bash
  echo "NODE_ENV=development" >> apps/server/.env
  echo "PORT=4000" >> apps/server/.env # Change this if needed
  echo "DATABASE_URL=file:./prisma/dev.db" >> apps/server/.env
  echo "JWT_SECRET=$(openssl rand -base64 32)" >> apps/server/.env
  ```

- Create a `.env` file in `apps/web/` with:
  ```bash
  echo "VITE_GRAPHQL_ENDPOINT=http://localhost:4000" >> apps/web/.env
  # Important: If you changed the PORT in apps/server/.env, update the port number here to match
  ```

- Run Prisma migrations to initialize the SQLite database:
  ```bash
  cd apps/server
  pnpm prisma migrate dev --name init
  ```

#### ✅ For Windows (PowerShell)

- Create the server `.env` file and set environment variables:
  ```powershell
  "NODE_ENV=development" | Out-File -FilePath apps/server/.env -Encoding utf8
  "PORT=4000" | Out-File -Append -FilePath apps/server/.env -Encoding utf8 # Change this if needed
  "DATABASE_URL=file:./prisma/dev.db" | Out-File -Append -FilePath apps/server/.env -Encoding utf8
  "JWT_SECRET=$([convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256})))" | Out-File -Append -FilePath apps/server/.env -Encoding utf8
  ```

- Create the web `.env` file:
  ```powershell
  "VITE_GRAPHQL_ENDPOINT=http://localhost:4000" | Out-File -FilePath apps/web/.env -Encoding utf8
  # Important: If you changed the PORT in apps/server/.env, update the port number here to match
  ```

#### ✅ Manual Method

1. Create a `.env` file inside `apps/server/`.
2. Add the following lines using a text editor:
   ```bash
   NODE_ENV=development
   PORT=4000 # Change this if needed
   DATABASE_URL=file:./prisma/dev.db
   JWT_SECRET=your-secret-key-here
   ```
   (Replace `"your-secret-key-here"` with a manually generated key or an online generator.)

3. Create a `.env` file inside `apps/web/`.
4. Add the following line using a text editor:
   ```bash
   VITE_GRAPHQL_ENDPOINT=http://localhost:4000
   ```
   > ***Important:** The port in `VITE_GRAPHQL_ENDPOINT` must match the PORT you specified in the server's .env file.*

- Then, run the Prisma migration:
  ```powershell
  cd apps/server
  pnpm prisma migrate dev --name init
  ```

---

4. **Start the servers:**

   - **Seed the database with test data:**
     ```bash
     pnpm seed
     ```
     - Initializes the database with test/demo data.

   - **Backend (Apollo Server):**
     ```bash
     cd apps/server
     pnpm dev
     ```
     - Runs on `http://localhost:4000` by default.

   - **Frontend (React with Vite):**
     ```bash
     cd apps/web
     pnpm dev
     ```
     - Runs on `http://localhost:5173` by default.


---

## Usage

- Open your browser and navigate to `http://localhost:5173` to access the frontend. (UI in progress).
- Visit `http://localhost:4000` to explore the GraphQL Playground and test queries. Note that in development mode, a simulated delay is added to resolver responses to simulate network latency.
- Core features commenting, and liking are still in development.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Project Structure

- **`apps/`**:
  - **`server/`**: The GraphQL server application built with Apollo Server and Prisma.
  - **`web/`**: The React web application using Vite and Apollo Client.
- **`packages/`**:
  - **`tailwind-config/`**: Shared Tailwind CSS configuration for consistent styling.
  - **`typescript-config/`**: Centralized TypeScript configuration for type safety.
  - **`ui/`**: Reusable UI components (e.g., buttons, spinners).
- **`utils/`**: Utility functions shared across the project.
- **Root Files**:
  - **`package.json`**: Manages root-level dependencies and scripts for the monorepo.
  - **`pnpm-workspace.yaml`**: Defines pnpm workspaces as `apps/*` and `packages/*`.
  - **`turbo.json`**: Configures Turborepo for efficient builds and task orchestration.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Developed by the Efrei M1 DEV1 team as a GraphQL learning project.

## Contact

For questions or feedback, please open an issue or reach out at [georgy.guei@efrei.net](mailto:georgy.guei@efrei.net).
