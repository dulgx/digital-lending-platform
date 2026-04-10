import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Ensure the parent directory is on the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.loan_application import LoanApplication, ApplicationStatus
from app.core.security import hash_password

# Mock Data Constants
FIRST_NAMES = ["Батбаяр", "Энхбаяр", "Төмөрбаатар", "Ганбаатар", "Мөнхбаяр", "Оюунбаяр", "Наранцэцэг", "Цэцэгмаа", "Энхтуяа", "Сарантуяа", "Болормаа", "Номинчимэг", "Дөлгөөн", "Уянга", "Хулан", "Анхбаяр", "Содномдорж", "Баярмаа", "Энхжаргал", "Мөнхзул"]
LAST_NAMES = ["Бат", "Ган", "Мөнх", "Энх", "Болд", "Дорж", "Пүрэв", "Цэрэн", "Нямаа", "Дамба", "Лхагва", "Сүрэн", "Гомбо", "Бямба", "Жамбал", "Лувсан", "Равдан", "Цэдэв", "Намдаг", "Очир"]

def main():
    print("🚀 Initializing Database Seeding...")
    db = SessionLocal()
    
    # Run schema creation in case tables don't exist yet
    Base.metadata.create_all(bind=engine)
    
    # 1. Check & Create an Admin User
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        print("🛠️ Creating system admin (admin@example.com / password)...")
        admin = User(
            name="System Admin",
            email="admin@example.com",
            password_hash=hash_password("password"),
            is_admin=True,
            salary=100000,
            age=35
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # 2. Check current user count to prevent redundant seeding
    existing_users = db.query(User).filter(User.is_admin == False).count()
    if existing_users >= 50:
        print("✅ Users already exist. Fetching existing users to generate applications...")
        users = db.query(User).filter(User.is_admin == False).all()
    else:
        print("👥 Generating 50 realistic mock users...")
        users = []
        
        for _ in range(50):
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            domain = random.choice(["gmail.com", "yahoo.com", "outlook.com", "magicnet.mn", "mongol.net", "mcs.mn"])
            email = f"{first_name.lower()}.{last_name.lower()}{random.randint(10, 9999)}@{domain}"
            
            salary = float(random.randint(25000, 150000))
            age = random.randint(21, 65)
            
            user = User(
                name=f"{first_name} {last_name}",
                email=email,
                password_hash=hash_password("password123"), # Universal password for mock users
                salary=salary,
                age=age,
                is_admin=False
            )
            users.append(user)

        db.add_all(users)
        db.commit()
        
        # Retrieve generated IDs
        for user in users:
            db.refresh(user)

    print("💳 Generating loan applications for users...")
    
    existing_apps = db.query(LoanApplication).count()
    if existing_apps >= 50:
        print("✅ Loan applications already generated. Skipping.")
        return
        
    statuses = list(ApplicationStatus)
    applications_created = 0
    
    for user in users:
        # Generate 1 to 3 applications per user for rich data
        num_apps = random.randint(1, 3)
        for _ in range(num_apps):
            amount = float(random.randint(1000, 50000))
            term_months = random.choice([6, 12, 24, 36, 48, 60])
            
            # Simulate realistic scoring correlate with salary
            base_score = min(max(int((float(user.salary) / 1000) * 0.45 + 30), 0), 100)
            noise = random.randint(-20, 20)
            final_score = min(max(base_score + noise, 0), 100)
            
            # Bias distribution slightly
            status = random.choices(
                population=statuses,
                weights=[0.3, 0.4, 0.2, 0.1], # Pending, Approved, Rejected, Review
                k=1
            )[0]
            
            # Simulate some applications coming from B2B partners
            is_b2b = random.choice([True, False, False])
            customer_data = None
            if is_b2b:
                customer_data = {
                    "source": "Partner API Request",
                    "transactions_analysis_reasons": ["Consistent income detected (+15 pts)", "Healthy savings buffer (+10 pts)"],
                    "partner_reference": f"B2B-{random.randint(10000, 99999)}"
                }
            
            app = LoanApplication(
                user_id=user.id,
                amount=amount,
                term_months=term_months,
                score=final_score,
                status=status,
                is_b2b=is_b2b,
                customer_data=customer_data
            )
            
            # Randomize application creation dates across the last 60 days
            days_ago = random.randint(0, 60)
            app.created_at = datetime.now(timezone.utc) - timedelta(days=days_ago)
            
            db.add(app)
            applications_created += 1
            
    db.commit()
    print(f"🎉 Successfully seeded 50 users and {applications_created} loan applications!")

if __name__ == "__main__":
    main()
