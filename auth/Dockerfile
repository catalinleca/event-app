FROM node:alpine

WORKDIR /app
COPY package.json --only=prod
RUN npm install
COPY . .

CMD ["npm", "start"]
