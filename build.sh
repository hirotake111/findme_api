#!/bin/bash

#
# build development Docker image
#
IMAGE=findme-api-development
echo "======== Building Docker image '$IMAGE' ========"
docker build -t $IMAGE -f Dockerfile.dev .
