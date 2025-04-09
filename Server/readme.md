# Node.js Express Application

This is a Node.js Express application designed to manage business operations, including inventory management, sales analytics, and customer support.

## Features
- Role-based dashboards for Admin and Manager.
- Inventory management.
- Sales analytics and reporting.
- Customer support tools.

## Prerequisites
Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerization)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   npm install
   npm run build
   ```

## Running with Docker
1. Build the Docker image:
   ```bash
   docker build -t node-express-app .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 3003:3003 node-express-app
   ```
3. Access the application at `http://localhost:3000`.