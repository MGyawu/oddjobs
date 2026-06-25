import os
import time
from app import create_app
from extensions import db

app = create_app(os.environ.get("DATABASE_URL"))
with app.app_context():
    print("App Created")
    max_retries = 10
    for attempt in range(max_retries):
        try:
            db.create_all()
            print("Tables Created")
            break
        except Exception:
            if attempt < max_retries - 1:
                print("Database not ready, retrying in 5sec ... ({attempt + 1}/{max_retries})")
                time.sleep(5)
            else:
                raise