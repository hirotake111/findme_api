## Findme API server

API server for my portofolio [Findme](https://findme.hiro.one)

### Required environment variables

- SECRETKEY - secret key for api server
- PORT (optional) - port number to listen on
- NODE_ENV - node environment

### Build docker image

```bash
# production
docker -t $IMAGE .

# development
./build.sh
```

### Required secrets for GitHub Actions

- DOCKER_USERNAME
- DOCKER_PASSWORD
- DOCKER_IMAGE_TAG_NAME - image name
- K8S_CONFIG_DATA - YAML based data to deploy imaget to Kubernetes cluster
- K8S_CONTAINER_NAME - container name
- K8S_DEPLOYMENT_NAME - deployment name
