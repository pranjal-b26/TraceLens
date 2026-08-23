from app.db import engine, Base
from app.models import models

def init_db():
    print("Creating database tables...")
    Base.metadata.drop_all(bind=engine) # Drop all to apply new schema
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
