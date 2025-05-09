FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .

RUN npm run db:migrate

EXPOSE 4002

CMD ["npm", "run", "dev"]