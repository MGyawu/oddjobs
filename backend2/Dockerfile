# Backend Dockerfile (backend2/Dockerfile)
FROM python:3.14-slim-bookworm

WORKDIR /app

#Update Debian packages
RUN apt-get update && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

#Update Python package and tooling
RUN pip install --no-cache-dir --upgrade \
    pip setuptools wheel

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && chown -R appuser:appuser /app

ENV FLASK_APP=app.py
EXPOSE 5000

USER appuser
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"]