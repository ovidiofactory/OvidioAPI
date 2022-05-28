FROM node:16-alpine
RUN mkdir /app
WORKDIR /app
EXPOSE 8080
ADD . .
ENTRYPOINT [ "npm","run", "start" ]