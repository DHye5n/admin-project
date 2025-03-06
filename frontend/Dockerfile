FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY ./build/ /usr/share/nginx/html/

RUN ls -al ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]