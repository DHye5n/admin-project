# 빌드된 애플리케이션을 Nginx로 서빙
FROM nginx:alpine

COPY --from=build /build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]