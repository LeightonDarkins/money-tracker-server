FROM node:boron

ENV NODE_ENV="production"
ENV PORT="3020"

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3020
USER node
CMD [ "npm", "start" ]
