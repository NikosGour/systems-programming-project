# NOTE: This Dockerfile is only ment to be run from the root of the project
# if you don't undestand what this means, just don't build the docker image
# and use the docker-compose file instead
FROM node:slim AS builder

WORKDIR /app

RUN mkdir -p recommender/bin

COPY ["./recommender/bin", "./recommender/bin"]

COPY ["./recommender/tsconfig.json", "./recommender/tsconfig.json"]

RUN mkdir data_storage

WORKDIR /app/data_storage

COPY ./data_storage .

RUN npm i

RUN npm i -g typescript

# ENTRYPOINT /bin/bash -c "echo 'Hello World'; sleep infinity"

RUN tsc -b

FROM node:slim

WORKDIR /app

RUN mkdir -p recommender/bin

COPY ["./recommender/bin", "./recommender/bin"]

COPY ["./recommender/tsconfig.json", "./recommender/tsconfig.json"]

COPY ["./recommender/package.json", "./recommender/package.json"]

WORKDIR /app/recommender

RUN npm i

WORKDIR /app

RUN mkdir data_storage

WORKDIR /app/data_storage

COPY --from=builder /app/data_storage/bin bin

COPY --from=builder /app/data_storage/package.json .

COPY --from=builder /app/data_storage/.env .

COPY --from=builder /app/data_storage/node_modules node_modules

ENTRYPOINT [ "node", "bin/index.js" ]
# ENTRYPOINT /bin/bash -c "echo 'Hello World'; sleep infinity"