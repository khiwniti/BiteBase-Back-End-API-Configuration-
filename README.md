## Features

- **FastAPI Backend**: A high-performance API backend built with FastAPI.
- **Astro Frontend**: A modern frontend framework to monitor and manage API resources.
- **PostgreSQL Integration**: Embedded PostgreSQL database for data storage.
- **Dockerized Deployment**: Easy deployment using Docker and Docker Compose.
- **Environment Configuration**: Configurable environment settings for development and production.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/astro-auth-api.git
    cd astro-auth-api
    ```

2. Set up environment variables:
    ```sh
    cp backend/.env.example backend/.env
    ```

3. Build and start the application using Docker Compose:
    ```sh
    docker-compose up --build
    ```

### Backend Configuration

The backend is configured using environment variables defined in the `.env` file located in the [backend](http://_vscodecontentref_/2) directory. Ensure you have the necessary environment variables set up for PostgreSQL and other services.

### Auth API List

The following is a list of available authentication API endpoints:

- **POST /api/v1/auth/login**: Authenticate a user and return a JWT token.
- **POST /api/v1/auth/register**: Register a new user.
- **POST /api/v1/auth/logout**: Log out a user.
- **GET /api/v1/auth/me**: Retrieve the authenticated user's information.
- **POST /api/v1/auth/refresh**: Refresh the JWT token.
- **POST /api/v1/auth/password-reset**: Request a password reset.
- **POST /api/v1/auth/password-reset/confirm**: Confirm a password reset.
- **GET /api/v1/auth/facebook**: Authenticate a user using Facebook OAuth.
- **GET /api/v1/auth/facebook/callback**: Facebook OAuth callback endpoint.
- **GET /api/v1/auth/google**: Authenticate a user using Google OAuth.
- **GET /api/v1/auth/google/callback**: Google OAuth callback endpoint.

### Frontend Configuration

The frontend is built using Astro and is located in the [frontend](http://_vscodecontentref_/3) directory. The frontend interacts with the backend API to provide a user-friendly interface for managing API resources.

### Running the Application

To run the application, use Docker Compose:
```sh
docker-compose up --build