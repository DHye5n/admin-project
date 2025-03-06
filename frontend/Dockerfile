FROM node:20-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

COPY public/index.html /app/public/index.html

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]