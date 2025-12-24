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

| Day | Date | Module | Technical Implementation & Key Learnings |
| :--- | :--- | :--- | :--- |
| **01** | Dec 24 | **Category Module (MVC Setup)** | **1. Architecture Setup:**<br>• Established the project structure with `Controller`, `Service`, and `Model` packages.<br>• Implemented **Loose Coupling** using Service Interface pattern (`CategoryService` interface & `CategoryServiceImpl` class).<br><br>**2. API Development:**<br>• Created RESTful endpoints using `@RestController`, `@GetMapping`, `@PostMapping`, and `@DeleteMapping`.<br>• Handled HTTP Requests and Responses.<br><br>**3. Data Handling:**<br>• Used `ArrayList` for temporary in-memory data storage (simulating database).<br>• Utilized **Java Stream API** to filter and find categories by ID.<br>• Fixed `NoSuchElementException` by properly handling `Optional` types in delete logic. |
 
---

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