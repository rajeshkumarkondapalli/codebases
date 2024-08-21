Docker multi platform commands

```docker
docker buildx create --name m1 --use
docker buildx inspect m1 --bootstrap

docker buildx build --platform linux/amd64,linux/arm64 -t mydockerhubusername/myimage:latest --load .
docker push mydockerhubusername/myimage:latest

docker buildx build --platform linux/amd64,linux/arm64 -t username/repository:tag --push .
```
This example creates a builder instance, inspects it, 
and builds a multi-platform image for linux/amd64 and linux/arm64, 
tagging it with username/repository:tag and pushing it to the Docker registry.

----------------------------------------------

- Create a builder instance.

```docker
docker buildx create --name m1 --use
docker buildx inspect m1 --bootstrap

#docker buildx create --use
#docker buildx inspect --bootstrap
```

- Build the Docker image using docker buildx build with appropriate flags for your needs.
```docker
docker buildx build --platform linux/amd64,linux/arm64 -t username/repository:tag .
```

- Push or load the image.
docker buildx build --platform linux/amd64,linux/arm64 -t username/repository:tag --push .

----------------------------------------------
docker buildx build --platform linux/amd64,linux/arm64 -t username/repository:tag --load .
docker buildx build --platform linux/amd64,linux/arm64 -t username/repository:tag --load .









