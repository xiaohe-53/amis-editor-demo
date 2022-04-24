FROM node:16.14.2

RUN mkdir -p /etc/amis-editor

WORKDIR /etc/amis-editor

COPY . .

EXPOSE 9000

ENTRYPOINT [ "npm", "run", "server" ]
