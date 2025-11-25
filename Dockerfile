version: "3.9"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      MICROCMS_SERVICE_DOMAIN: ${MICROCMS_SERVICE_DOMAIN}
      MICROCMS_API_KEY: ${MICROCMS_API_KEY}
