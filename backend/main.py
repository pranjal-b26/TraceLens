from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import cases, evidence, reports

app = FastAPI(title="TraceLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router, prefix="/api")
app.include_router(evidence.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "TraceLens backend is running 🚀"}