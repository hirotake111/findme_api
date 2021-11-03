#!/bin/bash

#
# build development Docker image
#
IMAGE=findme-api-development
docker build -t $IMAGE -f Dockerfile.dev .
