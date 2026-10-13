# 🎓 CampusConnect – College Event & Club Management System

CampusConnect is a full-stack web application designed to simplify college event management and club activities. It provides a centralized platform where students can explore events, register for activities, and connect with college clubs, while administrators can manage events, users, and registrations.

## 🚀 Features

### 👨‍🎓 Student
- User registration and login
- Secure authentication using JWT
- Browse and explore college events
- Register for events
- View event details and registration status
- Manage student profile

### 🛡️ Admin
- Admin login and role-based access
- Manage students and users
- Create, update, and delete events
- Manage college clubs and activities
- View and manage event registrations
- Monitor event and registration details

### 🔐 Security
- Spring Security integration
- JWT-based authentication
- Role-based authorization
- Protected routes for students and administrators

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- React Router
- Axios
- CSS

**Backend**
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Gradle

**Database**
- MySQL

**Tools**
- Git and GitHub
- Visual Studio Code
- IntelliJ IDEA
- Postman

## 🏗️ System Architecture

```text
React Frontend (Vite)
        |
        | REST API / Axios
        v
Spring Boot Backend
        |
        | Spring Data JPA
        v
    MySQL Database
```

## 📂 Project Structure

```text
CampusConnect-College-Event-Club-Management-System/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── build.gradle
│   └── settings.gradle
│
└── README.md
```

*Note: Adjust the folder names above to match your actual repository structure.*

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Java Development Kit (JDK 21, if configured in your project)
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/SKANDAMV27/CampusConnect-College-Event-Club-Management-System.git
cd CampusConnect-College-Event-Club-Management-System
```

### 2. Configure the Database

Create the MySQL database:

```sql
CREATE DATABASE collect_connect;
```

Update your backend `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/collect_connect
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password. Never commit actual database credentials to GitHub.

### 3. Run the Backend

Open a terminal in the backend directory:

```bash
gradlew.bat bootRun
```

On macOS or Linux, use:

```bash
./gradlew bootRun
```

The backend will start on the configured Spring Boot port. Check `application.properties` for the exact port.

### 4. Run the Frontend

Open another terminal in the frontend directory:

```bash
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔑 Authentication Flow

1. A user logs in through the React frontend.
2. The frontend sends credentials to the Spring Boot REST API.
3. The backend validates the credentials.
4. On successful authentication, the backend returns a JWT if token authentication is configured.
5. The frontend uses the token to access protected APIs.
6. Role-based authorization controls access to student and admin features.

## 🧪 API Testing

Use Postman to test the backend REST APIs.

Test the following flows, depending on the endpoints implemented in your project:

- Student registration
- User login and authentication
- Event creation and management
- Event listing and details
- Event registration
- Student profile management
- Admin-only operations

## 🔮 Future Enhancements

- Email notifications for event registrations
- Event reminders and announcements
- Club membership management
- Event attendance tracking using QR codes
- Event search and filtering
- Dashboard analytics and reports
- Cloud deployment

## 🤝 Contributing

Contributions and suggestions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch to GitHub.
5. Open a pull request.

## 👨‍💻 Author

**Skanda M V**

- GitHub: [@SKANDAMV27](https://github.com/SKANDAMV27)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/skanda-m-v-5b2a56311/)

---

⭐ If you find this project useful, consider giving the repository a star!

**CampusConnect – Connecting Students, Clubs, and Campus Events.** 🎓
