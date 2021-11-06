## Findme API server

API server for my portofolio [Findme](https://findme.hiro.one)

### Build docker image

```bash
# production
docker -t $IMAGE .

# development
./build.sh
```

### Required environment variables

- NODE_ENV - node environment
- SECRETKEY - secret key for api server
- PORT (optional) - port number to listen on
- REDIS_URL - URL for Redis

### Required secrets for GitHub Actions

- DOCKER_USERNAME
- DOCKER_PASSWORD
- DOCKER_IMAGE_TAG_NAME - image name
- K8S_CONFIG_DATA - YAML based data to deploy image to Kubernetes cluster (ALSO NEEDS TO BE BASE64 ENCODED!)
- K8S_CONTAINER_NAME - containers.name
- K8S_DEPLOYMENT_NAME - metadata.name
