FROM node:slim AS builder

WORKDIR /app

COPY . .

RUN npm i

RUN npm i -g typescript

RUN tsc

FROM node:slim

WORKDIR /app

COPY --from=builder /app/bin bin

COPY --from=builder /app/package.json .

COPY --from=builder /app/.env .

COPY --from=builder /app/node_modules node_modules

EXPOSE 6969

ENTRYPOINT [ "node", "bin/index.js" ]