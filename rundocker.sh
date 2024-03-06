#!/bin/bash

echo "Stopping running Docker containers..."
docker-compose down

echo "Removing existing Docker images for services defined in docker-compose.yml..."
docker-compose rm -f

echo "Building Docker images..."
docker-compose build --no-cache

echo "Starting Docker containers..."
docker-compose up -d

echo "Docker containers are up and running."
