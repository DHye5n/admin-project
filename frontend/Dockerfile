FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]