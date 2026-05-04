from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent


def get_env_list(key):
    return [v.strip() for v in os.getenv(key, "").split(",") if v.strip()]


# -------------------------------
# Security
# -------------------------------
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "unsafe-dev-key-change-me-32-bytes-minimum",
)

DEBUG = os.getenv("DEBUG", "True").lower() == "true"

DEV_ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]", "testserver"]
ALLOWED_HOSTS = get_env_list("ALLOWED_HOSTS") or (DEV_ALLOWED_HOSTS if DEBUG else [])


# -------------------------------
# Installed Apps
# -------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",

    # Local apps
    "users",
    "pets",
    "adoption",
    "categories",
    "notifications",
    "dashboard",
]


# -------------------------------
# Middleware
# -------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# -------------------------------
# URLs & WSGI
# -------------------------------
ROOT_URLCONF = "core.urls"
WSGI_APPLICATION = "core.wsgi.application"


# -------------------------------
# Templates
# -------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# -------------------------------
# Database
# -------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("DB_NAME", "petpal_db"),
        "USER": os.getenv("DB_USER", "petpal_user"),
        "PASSWORD": os.getenv("DB_PASSWORD", "password123"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "3306"),
    }
}


# -------------------------------
# Auth
# -------------------------------
AUTH_USER_MODEL = "users.User"


# -------------------------------
# Password Validation
# -------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# -------------------------------
# Internationalization
# -------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"

USE_I18N = True
USE_TZ = True


# -------------------------------
# Static & Media
# -------------------------------
STATIC_URL = "static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# -------------------------------
# Django REST Framework
# -------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}


# -------------------------------
# JWT Configuration
# -------------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}


# -------------------------------
# CORS
# -------------------------------
CORS_ALLOW_ALL_ORIGINS = DEBUG

CORS_ALLOWED_ORIGINS = get_env_list("CORS_ALLOWED_ORIGINS")

CSRF_TRUSTED_ORIGINS = get_env_list("CSRF_TRUSTED_ORIGINS")
