FROM node:current-slim

COPY . .

RUN npm install

CMD npm run docker:start