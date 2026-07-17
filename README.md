# Trusted Vehicle Repair Hub 🔧🚗

A full-stack, responsive web application that connects vehicle owners with nearby, verified repair shops. Customers can book repair requests, track job progress logs in real-time, and leave ratings/reviews. Shop owners onboard mechanics and assign incoming bookings, while admins oversee verification and metrics.

---

## 🛠️ Tech Stack & Features

*   **Backend:** Spring Boot 3.x, Spring Data JPA, Spring Security, JWT (Stateless Auth), MySQL.
*   **Frontend:** React 18 (Vite), React Router v6, Axios, Bootstrap 5 + Custom animations.
*   **Security:** Password hashing with BCrypt, role-based path security checks, stateless JWT interceptors.

---

## 🔑 Demo Seed Credentials

Upon initial database boot, the system auto-seeds the following test profiles (Passwords are encoded in the DB via BCrypt):

| Name / Entity | Role | Email | Password | Details |
|---|---|---|---|---|
| **Platform Admin** | `ADMIN` | `admin@vrh.com` | `admin123` | Can approve shops, inspect users list, catalog creation. |
| **Sarah Connor** | `SHOP_OWNER` | `owner1@vrh.com` | `owner123` | Owns "AutoPro Care Center" (Chennai, APPROVED). |
| **Tony Stark** | `SHOP_OWNER` | `owner2@vrh.com` | `owner123` | Owns "Stark QuickFix Garage" (Bangalore, APPROVED). |
| **Bruce Wayne** | `CUSTOMER` | `customer1@vrh.com` | `customer123` | Profile includes a Tesla Model 3. |
| **Peter Parker** | `CUSTOMER` | `customer2@vrh.com` | `customer123` | Profile includes a Honda Civic. |
| **John Doe** | `MECHANIC` | `john@vrh.com` | `mechanic123` | Specialization: Engine Tuning (AutoPro). |
| **Jane Smith** | `MECHANIC` | `jane@vrh.com` | `mechanic123` | Specialization: Brake Overhauls (AutoPro). |
| **Bob Johnson** | `MECHANIC` | `bob@vrh.com` | `mechanic123` | Specialization: Tyres & Electricals (QuickFix). |

---

## 🚀 Getting Started

### 1. Database Setup
Ensure you have MySQL running. The application properties are configured to look for the database `vrh_db` on port `3306` with username `root` and password `root`. It will auto-create the schema on launch:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vrh_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### 2. Run the Backend (Java/Maven)
Navigate into the `backend/` directory and run using Maven or your preferred Java IDE:
```bash
cd backend
mvn spring-boot:run
```
*The API server starts up on `http://localhost:8080`.*
*Swagger UI is available at `http://localhost:8080/swagger-ui.html` for endpoint testing.*

### 3. Run the Frontend (Vite/React)
Navigate into the `frontend/` directory, install packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*The React application starts up on `http://localhost:5173`.*

---

## 📂 Project Architecture

```
Vehicle repair hub/
├── backend/                     # Spring Boot Application
│   ├── src/main/java/com/vrh/
│   │   ├── config/              # Security configurations & JWT Filters
│   │   ├── controller/          # REST Endpoint Controllers (Role-guarded)
│   │   ├── dto/                 # Uniform Requests & Responses
│   │   ├── entity/              # JPA Data Entities (User, Shop, Vehicle, etc.)
│   │   ├── exception/           # Custom exception mappings to JSON wrappers
│   │   ├── repository/          # Spring Data JPA Repository layers
│   │   └── service/             # Business log logic & workflows
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                    # Vite React Client
    ├── src/
    │   ├── api/                 # Axios configuration with JWT headers interceptor
    │   ├── components/          # Reusable layout UI components
    │   ├── context/             # Global AuthContext provider
    │   ├── pages/               # Dashboards categorized by User Roles
    │   ├── routes/              # Client-side router route guards
    │   ├── App.jsx              # Main router mappings
    │   └── index.css            # Custom Premium Theme styles
    └── vite.config.js
```

---

## 🔒 Security Design Rules

1.  **Strict Isolation:** A user has exactly one role at a time. Shop Owners and Mechanics are mutually exclusive.
2.  **Verification Gate:** A Shop Owner's garage defaults to `PENDING` status. Only when an Admin logs in and updates the status to `APPROVED` does the shop become visible to Customers.
3.  **Owner Assignment Rights:** Only the owner of the shop can view booking tickets for that garage and assign one of their registered mechanics.
4.  **Mechanic Task Isolation:** A mechanic can only see their explicitly assigned tickets and has sole authority to transition status levels: `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
5.  **Review Lock:** Ratings and reviews can only be submitted for jobs with status `COMPLETED`. Writing a review automatically recalculates the shop's average score.
