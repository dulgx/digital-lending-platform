# 💳 Digital Lending Platform

**Бүрэн онлайн, салбаргүй зээлийн систем (Branchless Lending Platform)**
Хэрэглэгч зээлийн хүсэлт гаргаж, систем автоматаар оноо (credit score) бодон шийдвэр гаргадаг финтек платформ.

---

## 🚀 Төслийн тухай

Энэхүү төсөл нь уламжлалт салбарт суурилсан зээлийн үйлчилгээг бүрэн цахимжуулж,
хэрэглэгчийг **онлайнаар шууд зээл авах боломжтой** болгох зорилготой.

### 🎯 Гол боломжууд:

* 👤 Хэрэглэгч бүртгэл, нэвтрэлт (JWT authentication)
* 🔑 B2B API Integrations (API key authentication)
* 📝 Зээлийн хүсэлт гаргах (Шууд болон B2B)
* 🧠 Автомат кредит оноо (Credit & Smart Scoring Engine)
* ⚖️ Автомат шийдвэр (Approve / Reject / Review)
* 💰 Зээлийн бүртгэл үүсгэх
* 📆 Эргэн төлөлтийн хуваарь (Repayment Schedule)
* 🔔 Webhook notifications (B2B application status updates)
* 🛠️ Admin panel (гар аргаар шийдвэр гаргах боломж)

---

## 🏗️ Системийн архитектур

```
Frontend (Next.js)
        ↓
Backend API (FastAPI)
        ↓
PostgreSQL Database
```

👉 MVP хувилбар нь **modular monolith** бүтэцтэй
👉 Дараа нь microservices болгон өргөтгөх боломжтой

---

## 🧠 Credit Scoring Engine

Систем нь хэрэглэгчийн мэдээлэл дээр үндэслэн оноо бодно:

* Орлого (salary)
* Зээлийн хэмжээ (loan amount)
* Нас (age)
* Бусад эрсдэлийн үзүүлэлт

### Жишээ:

* Score > 70 → ✅ Approve
* 50–70 → ⚠️ Review
* < 50 → ❌ Reject

---

## 🔄 User Flow

1. Хэрэглэгч бүртгүүлнэ
2. Профайл мэдээлэл бөглөнө
3. Зээлийн хүсэлт гаргана
4. Систем оноо бодно
5. Шийдвэр гарна
6. Зээл үүснэ (approve бол)
7. Эргэн төлөлтийн хуваарь үүснэ

---

## 🗂️ Төслийн бүтэц

```
digital-lending-platform/
  backend/
    app/
      core/        → config, database, security (JWT)
      models/      → SQLAlchemy ORM models
      routers/     → API endpoints
      schemas/     → Pydantic request/response schemas
      services/    → scoring engine, decision engine
    main.py        → FastAPI entrypoint
    requirements.txt
    .env.example
  docs/
    PRD.md
    architecture.md
  README.md
```

---

## ⚙️ Ашигласан технологи

### Frontend

* Next.js
* Tailwind CSS

### Backend

* FastAPI (Python)

### Database

* PostgreSQL

### Authentication

* JWT

### Deployment

* Vercel (Frontend)
* Render / Railway (Backend)
* Managed PostgreSQL

---

## 📦 Үндсэн API-ууд

### Auth

* `POST /auth/register`
* `POST /auth/login`

### Loan

* `POST /loan/apply`
* `GET /loan/applications`
* `GET /loan/:id`

### B2B API

* `POST /b2b/apply` (Requires API Key)

### Repayment

* `GET /repayment/:loanId`

### Admin

* `GET /admin/applications`
* `POST /admin/decision`

---

## 🔐 Аюулгүй байдал

* Password hashing (bcrypt)
* JWT authentication
* Input validation

---

## 🚀 Ирээдүйн сайжруулалт

* 📲 Mobile app
* 🤖 AI/ML credit scoring
* 🧾 KYC verification
* 💳 Payment gateway integration
* 🔔 Notification system (SMS/Email)

---

## 🎥 Demo

👉 lending.dulgx.com

---

## 📌 Зорилго

Энэхүү төсөл нь:

* Fintech системийн архитектур ойлголт харуулах
* Backend + business logic чадварыг харуулах
* Real-world lending flow хэрэгжүүлэх

---

## 👨‍💻 Developer

**Dulguun Purevtseren**

* Backend Developer (Fintech / Odoo / Loan Systems)
* Mongolia 🇲🇳

---

## ⭐ Notes

Энэхүү төсөл нь **production system биш**, харин:
👉 demo / portfolio зориулалттай
👉 архитектур болон бизнес логик харуулах зорилготой

---
