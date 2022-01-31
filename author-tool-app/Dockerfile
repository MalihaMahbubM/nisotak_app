
#Building the Author Tool Interface
FROM node:12-alpine AS builder

WORKDIR /app

COPY ./author-tool-app .

RUN yarn

RUN yarn build

#Building nginx to serve it and create a reverse-proxy for all of the microservices.
FROM nginx:alpine

COPY ./nginx/dev.nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html
ENTRYPOINT [ "nginx", "-g", "daemon off;"]
