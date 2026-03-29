import pytest

def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
            "salary": 2000000,
            "age": 25
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_register_duplicate_email(client):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "salary": 2000000,
        "age": 25
    }
    client.post("/auth/register", json=user_data)
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_login_user(client):
    # First register
    client.post(
        "/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "password123",
            "salary": 1500000,
            "age": 30
        }
    )
    # Then login
    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_loan_application_flow(client):
    # 1. Register and Login
    client.post(
        "/auth/register",
        json={
            "name": "Loan User",
            "email": "loan@example.com",
            "password": "password123",
            "salary": 3000000,
            "age": 30
        }
    )
    login_response = client.post(
        "/auth/login",
        json={"email": "loan@example.com", "password": "password123"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Apply for a loan (good score expected to be approved)
    apply_response = client.post(
        "/loan/apply",
        headers=headers,
        json={
            "amount": 1000000,
            "term_months": 12
        }
    )
    if apply_response.status_code != 201:
        print("APPLY ERROR:", apply_response.json())
    assert apply_response.status_code == 201
    app_data = apply_response.json()
    assert app_data["status"] == "approved"    
    assert float(app_data["amount"]) == 1000000.0

    # 3. Check application generated
    applications_response = client.get("/loan/applications", headers=headers)
    assert applications_response.status_code == 200
    applications = applications_response.json()
    assert len(applications) == 1
