# Social Network Platform

This is a social network web application where users can register, post articles, comment on others' posts, and like articles. It’s built using modern technologies like React, GraphQL, and Prisma.

## Features

- User registration and authentication
- Article posting and management
- Commenting on articles
- Liking articles

## Tech Stack

- **Frontend:** React, Redux Toolkit, Apollo Client, TypeScript, TailwindCSS, React Router

- **Backend:** Apollo Server, Prisma (with SQLite), GraphQL Codegen

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**

    ```bash
    git clone git@github.com:Efrei-M1-DEV1/GraphQL-Project-Social-Network.git
    cd GraphQL-Project-Social-Network
    ```

2. **Install dependencies:**

    - For the backend:
        
            ```bash
            cd backend
            npm install
            ```

    - For the frontend:
        
            ```bash
            cd frontend
            npm install
            ```

3. **Set up the database:**

    - Run Prisma migrations:
        
            ```bash
            cd backend
            npx prisma migrate dev
            ```

4. **Start the servers:**
        
    - Backend:
        
            ```bash
            cd backend
            npm start
            ```

    - Frontend:
        
            ```bash
            cd frontend
            npm start
            ```

## Usage

- Navigate to [`http://localhost:3000`](http://localhost:3000) to access the frontend.
- Register a new account or log in with existing - credentials.
- Post articles, comment on others' posts, and like articles from the dashboard.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.

2. Create a new branch (`git checkout -b feature/your-feature`).

3. Commit your changes (`git commit -m 'Add your feature'`).

4. Push to the branch (`git push origin feature/your-feature`).

5. Open a pull request.

## Project Structure

- **backend/:** Contains the Apollo Server, Prisma schema, and GraphQL resolvers.

- **frontend/:** Contains the React application, including components, Redux slices, and Apollo Client setup.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or feedback, please open an issue or contact us at [georgy.guei@efrei.net](mailto:your-email@example.com).
