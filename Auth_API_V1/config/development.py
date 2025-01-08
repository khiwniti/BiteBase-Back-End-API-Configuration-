from pydantic_settings import BaseSettings

class DevelopmentConfig(BaseSettings):
    PROJECT_NAME: str = "BiteBase Development"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    CORS_ORIGINS: list[str] = ["*"]

    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABASE_URI: str

    JWT_SECRET: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    FACEBOOK_APP_ID: str
    FACEBOOK_APP_SECRET: str

    class Config:
        env_file = ".env"

