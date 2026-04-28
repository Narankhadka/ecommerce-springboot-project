# SabaikoPasal

> Multi-vendor e-commerce platform built with Spring Boot and React

A full-stack online marketplace tailored to the Nepali market, supporting customer shopping, seller storefronts, and admin oversight, with eSewa and Cash on Delivery payment flows.

> Final-year academic / portfolio project by [Naran Khadka](#author). Built end to end as a learning exercise in Spring Boot, JWT-based security, JPA modelling, and a production-style React + Redux Toolkit frontend.

---

## Demo / Screenshots

_Screenshots and a live demo link will be added here._

| Home | Product Page | Admin Dashboard |
|------|--------------|-----------------|
| _placeholder_ | _placeholder_ | _placeholder_ |

| Cart | Checkout (eSewa) | Seller Earnings |
|------|------------------|-----------------|
| _placeholder_ | _placeholder_ | _placeholder_ |

---

## Key Features

### Customer
- Email + password registration and login (JWT cookie + Bearer fallback)
- Forgot / reset password via emailed token
- Browse products with keyword search, category filter, sort, and pagination
- Product detail with reviews and "customers also bought" recommendations
- Persistent shopping cart synced to the backend on login
- Multiple delivery addresses with an interactive Leaflet map picker
- Checkout via eSewa (sandbox) or Cash on Delivery
- Order history page

### Seller
- Seller dashboard with own products, orders, and earnings
- Create, update, and delete own products with image upload
- Update order status for orders containing the seller's products
- Earnings overview with year / month / day filters and a monthly bar chart
- Editable seller profile

### Admin
- Analytics overview (product count, total orders, total revenue)
- Full product CRUD across all sellers
- Category CRUD
- Seller management (register, delete, reset password, assign category)
- User management (list, toggle active status, delete)
- Order management across the whole platform
- Promotions module with image upload and active / inactive toggle

---

## Technical Highlights

- **eSewa payment integration (sandbox)**. Backend generates an HMAC-SHA256 signature over `total_amount,transaction_uuid,product_code` for the eSewa v2 form, then performs a server-to-server status verification against `https://rc.esewa.com.np/api/epay/transaction/status/` before placing the order. See `PaymentController.java`.
- **JWT auth with role-based access control**. Three roles (`USER`, `SELLER`, `ADMIN`) enforced by Spring Security. Tokens are issued as a cookie and also accepted as a `Bearer` header by the frontend `axios` interceptor for cross-origin localhost development.
- **Recommendation engine**. `RecommendationServiceImpl` returns a "customers also bought" list based on co-purchase history from `OrderItem` joins, filling the remainder up to eight items with same-category products (`RecommendationRepository`).
- **Custom product search and sort utility**. `ProductSortSearchUtil` builds dynamic JPA queries for keyword, category, and sort criteria.
- **Email-based password reset** with single-use tokens (`PasswordResetToken` entity, Spring Mail).
- **OpenAPI / Swagger** generated automatically via `springdoc-openapi`.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Java 17, Spring Boot 4.0.1, Spring Web MVC, Spring Data JPA, Spring Security, Spring Boot Actuator, Spring Boot Mail, Bean Validation, JJWT 0.12.5, Lombok, ModelMapper, springdoc-openapi |
| **Frontend** | React 19, Vite 7, Redux Toolkit, React Router 7, MUI 7 + MUI X DataGrid, Tailwind CSS 4, Axios, react-hook-form, react-hot-toast, Recharts, Swiper, Leaflet + react-leaflet |
| **Database** | PostgreSQL (runtime), H2 (test scope) |
| **DevOps / Tooling** | Maven, Maven Wrapper, ESLint, PostCSS, Vite |

---

## Getting Started

### Prerequisites
- JDK 17
- Maven 3.9+ (or use the bundled `./mvnw`)
- Node.js 20+ and npm
- PostgreSQL 14+
- An SMTP account (Gmail App Password, Mailtrap, etc.) for the password reset emails
- An eSewa sandbox merchant code if you want to exercise the payment flow (the defaults `EPAYTEST` / sandbox secret are baked in for local testing)

### 1. Clone

```bash
git clone https://github.com/Narankhadka/ecommerce-springboot-project.git
cd ecommerce-springboot-project
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env   # then fill in real values
```

Create a PostgreSQL database (default name used in dev: `sb_ecom`):

```sql
CREATE DATABASE sb_ecom;
```

Provide configuration to Spring Boot in **one** of these ways:

- Export the variables in `.env` to your shell, or
- Create `backend/src/main/resources/application.properties` (gitignored) using the keys listed in `.env.example` (Spring Boot maps `SPRING_DATASOURCE_URL` to `spring.datasource.url`, etc.).

Then run:

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### 3. Frontend setup

```bash
cd ../efont
cp .env.example .env   # then fill in real values
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

### Environment variables

See `backend/.env.example` and `efont/.env.example` for the full list with placeholder values. At minimum you need:

**Backend**
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `SPRING_APP_JWTSECRET`, `SPRING_APP_JWTEXPIRATIONMS`, `SPRING_APP_JWTCOOKIENAME`
- `PROJECT_IMAGE` (local directory for uploaded images)
- `FRONTEND_URL` (used in CORS and in the eSewa redirect URLs)
- `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`, `SPRING_MAIL_FROM`
- `ESEWA_PRODUCT_CODE`, `ESEWA_SECRET_KEY` (defaults to the public sandbox values if omitted)

**Frontend**
- `VITE_BACK_END_URL` (e.g. `http://localhost:8080`)
- `VITE_FRONTEND_URL` (e.g. `http://localhost:5173`)
- `VITE_ESEWA_PAYMENT_URL` (defaults to the sandbox if omitted)
- `VITE_STRIPE_PUBLISHABLE_KEY` (only needed for the in-progress Stripe flow)

---

## API Documentation

Once the backend is running, Swagger UI is served at:

```
http://localhost:8080/swagger-ui/index.html
```

The OpenAPI JSON is at `http://localhost:8080/v3/api-docs`.

A non-exhaustive map of the main route groups:

| Group | Sample endpoints |
|-------|------------------|
| Auth | `POST /api/auth/signup`, `POST /api/auth/signin`, `POST /api/auth/signout`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| Public catalog | `GET /api/public/products`, `GET /api/public/products/keyword/{keyword}`, `GET /api/public/categories`, `GET /api/public/products/{id}/recommendations` |
| Cart | `GET /api/carts/users/cart`, `POST /api/carts/products/{productId}/quantity/{qty}`, `DELETE /api/carts/{cartId}/product/{productId}` |
| Orders | `POST /api/order/users/payments/{paymentMethod}`, `GET /api/orders/user`, `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` |
| Payments (eSewa) | `POST /api/payment/esewa/initiate`, `POST /api/payment/esewa/verify` |
| Reviews | `GET /api/public/products/{id}/reviews`, `POST /api/reviews/products/{id}` |
| Admin | `GET /api/admin/app/analytics`, `GET /api/admin/users`, `GET /api/admin/sellers`, `GET /api/admin/promotions` |
| Seller | `GET /api/seller/dashboard`, `GET /api/seller/orders`, `GET /api/seller/earnings` |

---

## Project Structure

```
ecommerce-springboot-project/
├── backend/                                      Spring Boot API
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd
│   └── src/main/java/com/ecommerce/project/
│       ├── EcommerceApplication.java
│       ├── controller/                           REST controllers (auth, product, cart, order, payment, admin, seller)
│       ├── service/ + serviceInterface/          Business logic
│       ├── repositories/                         Spring Data JPA repositories
│       ├── model/                                JPA entities (User, Role, Product, Category, Cart, Order, ...)
│       ├── payload/                              Request / response DTOs
│       ├── security/                             Spring Security config + JWT filter + UserDetailsService
│       ├── algorithm/                            ProductSortSearchUtil (custom sort / search)
│       ├── config/                               AppConfig, AppConstants, SwaggerConfig
│       ├── exceptions/                           Global exception handler + custom exceptions
│       └── util/                                 AuthUtil
│
├── efont/                                        React + Vite frontend
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx, main.jsx
│       ├── api/api.js                            Axios instance + JWT interceptor
│       ├── store/                                Redux Toolkit store, reducers, async actions
│       ├── components/
│       │   ├── shared/                           Navbar, Footer, ProductCard, modals, ...
│       │   ├── home/, products/, cart/, checkout/, profile/, auth/
│       │   └── admin/                            Dashboard, products, categories, orders, sellers, users, promotions, earnings
│       └── hooks/, utils/, assets/
│
└── README.md
```

---

## Roadmap

- [ ] **Stripe**: complete the integration. The current `/api/order/stripe-client-secret` endpoint returns a synthetic identifier; replace it with a real `PaymentIntent` created via the Stripe Java SDK and add a webhook handler for asynchronous confirmation.
- [ ] **Khalti**: implement the backend controller, service, and verification call. Frontend components and DTOs already exist but the corresponding Redux actions and Spring routes are not yet wired up.
- [ ] **Test coverage**: add unit tests for services, slice tests for repositories, and MockMvc tests for controllers. The project currently ships only the auto-generated `contextLoads()` smoke test.
- [ ] **Docker**: add a `Dockerfile` for the backend, a multi-stage build for the frontend, and a `docker-compose.yml` that brings up the API, frontend, and PostgreSQL together.
- [ ] **CI/CD**: GitHub Actions workflow to run `mvn verify` and `npm run lint && npm run build` on every PR, plus a release workflow that builds and pushes Docker images.
- [ ] **Image storage**: move uploaded product / promotion images off the local filesystem onto S3 or Cloudinary.
- [ ] **Analytics**: extend `/api/admin/app/analytics` with time-series data so the admin dashboard charts can render real numbers.
- [ ] Rename `efont/` to `frontend/`.

---

## Known Issues / Limitations

- **No automated tests yet** beyond `EcommerceApplicationTests.contextLoads()`. The full Spring Boot test starter and Spring Security Test are on the classpath but no service or controller tests have been written.
- **Stripe is scaffolded, not functional**. The Elements UI loads, but the backend returns a fake `pi_<uuid>_secret_<uuid>` and there is no real `PaymentIntent`.
- **Khalti is not wired up**. The Khalti UI components reference Redux actions (`initiateKhaltiPayment`, `verifyKhaltiAndPlaceOrder`) that are not currently exported, and there is no backend controller. Selecting Khalti at checkout will fail.
- **PayPal is intentionally disabled** at the UI level.
- **No Dockerfile or container orchestration yet.**
- **No CI/CD pipeline yet.** Linting and type checks are run manually.
- **Commit history is sparse and informal.** This is a learning project, not a team codebase.
- **Image uploads are stored on the local filesystem** under `PROJECT_IMAGE`. Production deployment would need object storage.

---

## License

This project is released under the [MIT License](LICENSE).

---

## Author

**Naran Khadka**

- GitHub: [@Narankhadka](https://github.com/Narankhadka)
- LinkedIn: [in/naran-khadka-0b331b217](https://linkedin.com/in/naran-khadka-0b331b217)
- Portfolio: [narankhadka.com.np](https://www.narankhadka.com.np/)

If you are a recruiter or hiring manager, I am happy to walk through the architecture, the eSewa signing flow, or the Redux state model in a screen-share. Reach out via LinkedIn.
