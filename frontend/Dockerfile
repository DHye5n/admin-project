FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]