FROM python:3.11-slim

WORKDIR /app

# install system deps for ml libs
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# copy requirements first
COPY ml-audit/requirements.txt .

# install python deps - this takes a while
RUN pip install --no-cache-dir -r requirements.txt

# copy source
COPY ml-audit/ .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
