FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]
