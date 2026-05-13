# Mobile Phone Inventory System

A full-stack inventory management system for mobile phone businesses that handles stock tracking, suppliers, customers, employees, and sales operations through a modular Node.js/Express backend with MySQL integration.

## Why it matters

This project is a good example of a real-world inventory system that combines:

- user-facing pages in `public/`
- API-driven backend routes in `src/routes/`
- persistent data storage in MySQL
- security via JWT authentication

It shows how to keep frontend and backend responsibilities separated while supporting the core flows needed by an inventory team.

## Features

- phone inventory management
- supplier management
- customer management
- employee management
- sales tracking system
- stock-entry and inventory operations
- JWT-based authentication
- protected API routes
- modular route handlers
- static frontend integration using HTML/CSS/JavaScript
- environment-based configuration with .env

## Tech stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT (`jsonwebtoken`)
- password hashing (`bcryptjs`)
- environment configuration (`dotenv`)
- CORS support (`cors`)

### Frontend
- HTML
- CSS
- JavaScript

### Database
- MySQL

## Authentication

Most /api/* endpoints are protected using JWT middleware.

After successful login, the backend generates a JWT token which must be included in requests:
```http
Authorization: Bearer <token>
```

Protected routes verify the token before allowing access to inventory operations.

## Screenshots
### Login 
![img](screenshots\login.png)
### Phone Section
![img](C:\Users\Public\Imp_Folders\WebDevelopment_Frontend\JS_Project\MobilePhoneSystem\screenshots\phoneSec.png)
### Add Phones
![img](screenshots\AddSection.png)
### View / Update Section
![img](screenshots\view_update.png)

> All other sectiones have also these features 
## Quick start

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the project root and set values like:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
JWT_SECRET=yourjwtsecret
JWT_EXPIRES_IN=1h
PORT=5000
```

4. Start the server:

```bash
node sql_server.js
```

5.Open the frontend pages from the public/ directory or serve them locally using Live Server.

> Note: Most `/api/*` endpoints are protected by JWT middleware. Add the `Authorization: Bearer <token>` header after login.

## Structure

- `sql_server.js` — main backend server and route mounting
- `src/config/db.js` — MySQL connection pool configuration
- `src/middleware/auth.js` — token verification middleware
- `src/routes/` — API route definitions for auth, suppliers, phones, customers, employees, sales
- `public/` — frontend static assets and HTML pages


## Future improvements

- add role-based access control so admin, sales, and inventory users have different permissions
- enable sales report generation and downloadable exports
- improve frontend workflow for page navigation and form validation
- improved frontend UI/UX
- enhanced backend validation
- support a more complete dashboard with analytics and inventory alerts

## Author
### Javairia Lateef
Github : https://github.com/JaVi080
linkdin : https://www.linkedin.com/in/javairialateef

