FROM node:14.16.0-alpine3.12

RUN mkdir -p /etc/amis-editor

WORKDIR /etc/amis-editor

COPY . .

EXPOSE 9000

ENTRYPOINT [ "npm", "run", "server" ]
