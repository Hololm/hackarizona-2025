#!/bin/bash

# Authenticate Docker to your Amazon ECR registry using the docker-user profile
aws ecr get-login-password --region us-west-2 --profile docker-user | docker login --username AWS --password-stdin 033303108318.dkr.ecr.us-west-2.amazonaws.com

# Build and push the frontend image
docker-compose build frontend
docker push 033303108318.dkr.ecr.us-west-2.amazonaws.com/pragmatic/frontend

# Build and push the backend image
docker-compose build backend
docker push 033303108318.dkr.ecr.us-west-2.amazonaws.com/pragmatic/backend