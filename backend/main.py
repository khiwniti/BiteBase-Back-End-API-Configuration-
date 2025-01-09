import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Auth_API_V1.api.v1.endpoints import auth
from Auth_API_V1.db.database import engine, Base
from config.development import DevelopmentConfig
from config.production import ProductionConfig

# Load the appropriate configuration based on the environment
config = ProductionConfig() if os.getenv("ENV") == "production" else DevelopmentConfig()

app = FastAPI(title=config.PROJECT_NAME, openapi_url=f"{config.API_V1_STR}/openapi.json")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{config.API_V1_STR}/auth", tags=["auth"])

# Create database tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Auth_API_V1.main:app", host="0.0.0.0", port=8000, reload=config.DEBUG)

