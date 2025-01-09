from pydantic_settings import BaseSettings

class ProductionConfig(BaseSettings):
    PROJECT_NAME: str = "BiteBase Production"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
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

