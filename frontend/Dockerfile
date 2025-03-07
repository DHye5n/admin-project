FROM nginx:alpine

COPY nginx.conf /app/etc/nginx/conf.d/my.conf

COPY build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]