# NOTE: This Dockerfile is only ment to be run from the root of the project
# if you don't undestand what this means, just don't build the docker image
# and use the docker-compose file instead
FROM node:slim AS builder

WORKDIR /app

RUN mkdir -p systems_programming_lib/bin

COPY ["./systems_programming_lib/bin", "./systems_programming_lib/bin"]

COPY ["./systems_programming_lib/tsconfig.json", "./systems_programming_lib/tsconfig.json"]

RUN mkdir data_generation

WORKDIR /app/data_generation

COPY ./data_generation .

RUN npm i

RUN npm i -g typescript

# ENTRYPOINT /bin/bash -c "echo 'Hello World'; sleep infinity"

RUN tsc -b

FROM node:slim

WORKDIR /app

RUN mkdir -p systems_programming_lib/bin

COPY ["./systems_programming_lib/bin", "./systems_programming_lib/bin"]

COPY ["./systems_programming_lib/tsconfig.json", "./systems_programming_lib/tsconfig.json"]

COPY ["./systems_programming_lib/package.json", "./systems_programming_lib/package.json"]

WORKDIR /app/systems_programming_lib

RUN npm i

WORKDIR /app

RUN mkdir data_generation

WORKDIR /app/data_generation

COPY --from=builder /app/data_generation/bin bin

COPY --from=builder /app/data_generation/package.json .

COPY --from=builder /app/data_generation/.env .

COPY --from=builder /app/data_generation/node_modules node_modules

ENTRYPOINT [ "node", "bin/index.js" ]
# ENTRYPOINT /bin/bash -c "echo 'Hello World'; sleep infinity"