FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

RUN ls -al ./

COPY build/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]