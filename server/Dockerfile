FROM node:alpine

RUN apk add --update --no-cache python3 make g++ \ 
	&& ln -sf python3 /usr/bin/python

ENV APP_DIR /app

WORKDIR $APP_DIR

COPY package*.json ./

RUN npm install && npm install -g nodemon

COPY . ${APP_DIR}

EXPOSE 8181

CMD ["node", "src/index"]
