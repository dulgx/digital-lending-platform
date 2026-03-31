# 📄 PRD —  Digital Lending Platform

## 1. Overview

A fully online lending platform where users can apply, get scored, and receive loan decisions without visiting a branch.

## 2. Target Users

* Salaried individuals
* Young professionals
* First-time borrowers
* B2B Partners (via API integrations)

## 3. Core Features

* User authentication & API Key management
* Loan application (Direct & B2B flows)
* Smart automated credit scoring (via Open Banking transaction analysis)
* Loan approval/rejection decision engine
* Repayment schedule
* Webhook notifications for B2B status updates

## 4. User Flow

### Direct-to-Consumer (D2C)
1. User registers
2. Completes profile
3. Applies for loan
4. System calculates score (Traditional + Smart Score)
5. Decision returned
6. Loan created
7. Repayment schedule generated

### B2B Partner Flow
1. Partner authenticates via API Key
2. Submits loan application on behalf of a customer via `/b2b/apply`
3. Engine analyzes provided customer data and Open Banking transactions
4. Instant decision returned synchronously to the Partner
5. Asynchronous webhook notifies Partner of status updates (`loan.status.updated`)

## 5. Functional Requirements

* Users can submit loan applications
* B2B Partners can submit applications programmatically via API
* System calculates score instantly combining traditional rules with transactional "Smart Score" limits
* System auto-approves, rejects, or flags for manual review based on combined score
* System fires webhooks to notify external systems of application status changes
* Admin can override decision

## 6. Non-Functional Requirements

* Fast response (<1s scoring)
* Secure authentication (JWT)
* Scalable backend

## 7. Success Metrics

* Application → decision time
* Approval rate
* User completion rate
