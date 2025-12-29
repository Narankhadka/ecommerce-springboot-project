    # 🛒 E-Commerce Application - Backend API

## 📖 Project Overview
This project serves as the **Backend REST API** for a full-stack E-Commerce application. It is built using **Java Spring Boot** and is designed to handle core business functionalities including product management, category classification, user authentication, and order processing.

The architecture follows the industry-standard **Layered Architecture (MVC Pattern)** to ensure scalability, maintainability, and clean code separation.

---

## 🛠 Tech Stack
* **Framework:** Spring Boot 3
* **Language:** Java 21
* **Build Tool:** Maven
* **Database:** MySQL (Implemented with Spring Data JPA)
* **Tools:** IntelliJ IDEA, Postman, Git

---

## 📅 Daily Learning & Development Log
## 📅 Daily Learning & Development Log

| Day    | Date   | Module                                  | Technical Implementation & Key Learnings |
| :----- | :----- | :-------------------------------------- | :-------------------------------------- |
| **01** | Dec 24 | **Category Module (MVC Setup)**         | **1. Architecture Setup:**<br>• Established project structure with separate `Controller`, `Service`, and `Model` layers.<br>• Implemented **loose coupling** using service interface pattern.<br><br>**2. API Development:**<br>• Built RESTful endpoints for CRUD operations.<br>• Managed HTTP requests and responses effectively.<br><br>**3. Data Handling & Logic:**<br>• Used in-memory data structures to simulate database operations.<br>• Applied Java Stream API to filter and search data.<br>• Handled optional values properly to avoid runtime exceptions. |
| **02** | Dec 26 | **JSP Integration & Persistence Layer** | **1. View Layer Integration:**<br>• Configured JSP pages to dynamically display data.<br>• Set up view resolver to map controller responses to JSP views.<br><br>**2. Persistence Layer:**<br>• Integrated Hibernate ORM with Spring Data JPA.<br>• Defined entity models with proper JPA annotations.<br>• Implemented repository layer for database interactions.<br><br>**3. Database & Tools:**<br>• Used H2 in-memory database for testing and development.<br>• Utilized H2 Console to inspect persisted data.<br><br>**4. Key Learnings:**<br>• Understood full MVC flow from view to database.<br>• Learned safe update and delete patterns using entity retrieval with proper exception handling. |
| **03** | Dec 29 | **Category Module – Validation & Exception Handling** | **1. Validation Implementation:**<br>• Enforced **duplicate name prevention** during updates to maintain unique category names.<br>• Added **same-value update prevention** to avoid unnecessary database writes.<br><br>**2. Exception Handling:**<br>• Implemented custom exceptions to handle business rule violations effectively.<br>• Ensured proper handling of invalid IDs and other potential errors.<br><br>**3. Key Learnings:**<br>• Learned to enforce business logic at the service layer.<br>• Gained understanding of Spring Data JPA conditional checks.<br>• Improved error messaging and API reliability.<br>• Strengthened knowledge of managed entity updates and safe data modification practices. |

## 🚀 Key Features Implemented So Far
- [x] **Category Management:**
    - Create new categories.
    - Fetch list of all categories.
    - Delete a specific category by ID.
- [ ] **Global Exception Handling** (Upcoming)
- [ ] **Database Integration** (Upcoming)

## 📂 Project Structure
```bash
src/main/java/com/ecommerce/project
├── controller  # Handles HTTP requests (API Layer)
├── service     # Business Logic Layer
├── model       # Data Representation (POJO)
└── EcommerceApplication.java # Entry Point