# 🏗️ Architecture — Branchless Digital Lending Platform

## 1. Overview

This system is a fully digital, branchless lending platform that allows users to apply for loans, get instant credit decisions, and manage repayments online.

The system is designed as a **modular monolith (MVP)** with the ability to evolve into microservices.

---

## 2. High-Level Architecture

[Frontend (Next.js)]
↓
[Backend API (FastAPI / NestJS)]
↓
[PostgreSQL Database]

External (optional):

* SMS/Email service
* KYC provider (mock)
* Credit bureau (mock)

---

## 3. Core Modules

### 3.1 Authentication Module

* User registration
* Login (JWT)
* Password hashing
* Token validation

---

### 3.2 User Profile Module

* Personal information
* Income/salary data
* Risk-related attributes

---

### 3.3 Loan Application Module

* Submit loan request
* Store application data
* Track application status

---

### 3.4 Credit Scoring Engine (Core)

* Traditional rule-based scoring + Transaction-based "Smart Scoring"
* Input:
  * salary
  * loan amount
  * age
  * Open Banking transaction history (for B2B Smart Score)
* Output:
  * score (base 0–100 + smart score impact -50 to +50)
  * decision (approve/reject/review)

---

### 3.5 Decision Engine

* Uses scoring result
* Applies thresholds
* Generates final decision

---

### 3.6 Loan Management Module

* Create loan after approval
* Store:

  * principal
  * interest
  * term
* Track loan status

---

### 3.7 Repayment Module

* Generate repayment schedule
* Track payments
* Status:

  * paid
  * overdue

---

### 3.8 Admin Module

* View applications
* Approve/reject manually
* View users and loans

---

### 3.9 B2B API Integration Module

* Dedicated API Key authentication for partners
* Proxy loan applications on behalf of customers
* Synchronous smart scoring & immediate response

---

### 3.10 Webhook Service

* Asynchronous event dispatching (via BackgroundTasks)
* Notifies B2B partners on crucial events like `loan.status.updated`

---

## 4. Data Flow

1. User registers and logs in (or Partner authenticates via API Key)
2. User/Partner submits loan application
3. Backend triggers scoring engine (evaluates base rules + transaction history)
4. Scoring engine returns combined score
5. Decision engine evaluates score
6. Loan is created if approved
7. Repayment schedule is generated
8. System fires webhook to partner (if B2B)
9. User/Partner views loan and repayment details

---

## 5. Database Design (Simplified)

### User

* id
* name
* email
* password_hash
* salary
* created_at

### LoanApplication

* id
* user_id
* amount
* term
* score
* status

### Loan

* id
* user_id
* amount
* interest_rate
* term
* monthly_payment
* status

### Repayment

* id
* loan_id
* due_date
* amount
* status

---

## 6. API Design (Sample)

POST /auth/register
POST /auth/login

POST /loan/apply
GET /loan/applications

GET /loan/:id
GET /repayment/:loanId

Admin:
GET /admin/applications
POST /admin/decision

---

## 7. Security Considerations

* JWT authentication
* Password hashing (bcrypt)
* Input validation
* Basic rate limiting (optional)

---

## 8. Scalability Plan (Future)

### Phase 2 (Microservices)

* Auth Service
* Loan Service
* Scoring Service
* Notification Service

Communication:

* REST → Event-driven (future)

---

## 9. Deployment Architecture

Frontend:

* Vercel

Backend:

* Render / Railway / VPS (Docker)

Database:

* Managed PostgreSQL

---

## 10. Future Enhancements

* External credit bureau integration
* AI/ML scoring
* Payment gateway
* Mobile app
* Real-time notifications
