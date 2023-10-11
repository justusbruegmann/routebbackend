FROM node:18-alpine
WORKDIR /usr/src
ENV PORT = 80
ENV DATABASE_URL = "mongodb+srv://justus:P%25bjk!DR%3Dch3@cluster0.vkxlpcj.mongodb.net/"
COPY . .
RUN npm install --production
CMD ["npx", "tsc"]
CMD ["node", "app"]
EXPOSE 80