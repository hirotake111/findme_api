## Findme API server

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
