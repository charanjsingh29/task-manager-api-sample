# 🧠 Task Management and Collaboration Platform

A scalable and modular Task Management System built using **Node.js (Express)** and **MySQL**, with real-time notifications, file uploads, and role-based permissions.

---

## 📦 Features

- 🔐 JWT-based Authentication with Refresh Token
- 🧑‍💼 Role-Based Access Control (RBAC)
- 📁 File Attachments for Tasks
- 💬 Commenting System for Tasks
- 🔄 Real-time Notifications via Socket.IO
- 📋 Comprehensive Project and Task Management
- 🔄 Task Assignment with Team/User linking
- 🔧 Docker + Sequelize

---

## 🏗️ Project Structure

### Users
- User registration, login, logout, and profile management
- JWT + bcrypt-based security
- Middleware to validate sessions

### Tasks
- CRUD for tasks with statuses (OPEN, PENDING, etc.)
- Task assignment to users
- Task comments and attachments

### Teams
- Team creation and management
- Assign users to teams

### Notifications
- Real-time notifications using Socket.IO
- User-wise unread notification tracking

### Roles & Permissions
- Role-based permissions (e.g., Admin, Manager)
- Assign roles to users, and permissions to roles
- Seeder included for permissions

---

## 📂 Endpoints Overview

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`

### User
- `GET /user/profile`
- `PUT /user/profile`

### Tasks
- `POST /tasks`
- `PUT /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `DELETE /tasks/:id`

### Task Assignment & Comments
- `POST /tasks/:id/users`
- `DELETE /tasks/:id/users/:user_id`
- `POST /tasks/:id/comments`
- `GET /tasks/:id/comments`
- `PUT /tasks/:id/comments/:comment_id`
- `DELETE /tasks/:id/comments/:comment_id`

### Task Attachments
- `POST /tasks/:id/attachments`
- `GET /tasks/:id/attachments`
- `PUT /tasks/:id/attachments/:attach_id`
- `DELETE /tasks/:id/attachments/:attach_id`

### Teams
- `POST /teams`
- `GET /teams`
- `PUT /teams/:id`
- `DELETE /teams/:id`

### Notifications
- `GET /notifications`
- `POST /notifications/mark_seen`


---

## 🛠️ Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Backend      | Node.js (Express)    |
| Auth         | JWT, bcrypt          |
| Database     | MySQL                |
| Realtime     | Socket.IO            |
| DevOps       | Docker, Nginx        |

---

## 📦 Dependencies

### Core
- `bcryptjs`
- `cookie-parser`
- `cors`
- `dotenv`
- `express`
- `express-validator`
- `jsonwebtoken`
- `moment`
- `multer`
- `mysql2`
- `nodemailer`
- `sequelize`
- `winston`

### Dev
- `nodemon`
- `sequelize-cli`

### Optional
- `node-cron`
- `socket.io`

---

## ⚙️ Security Features

- HTTPS recommended
- JWT expiration and refresh strategy
- Role-based route access
- File upload validation
- Input sanitization
- Global error handling middleware

---

## 📈 Scalability Strategy

- Stateless API design (supports horizontal scaling)
- Proper DB indexing for fast search/filter
- Rate limiting and input validation
- Redis caching (for sessions, metadata)
- Event-driven architecture (Kafka/Redis streams - optional)

---

## 🚀 Deployment

The app is Docker-ready. Use Nginx for routing and reverse proxy.


