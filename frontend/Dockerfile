# 빌드된 애플리케이션을 Nginx로 서빙
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY ./nginx.conf /etc/nginx/nginx.conf

# 빌드된 프론트엔드 파일을 Nginx HTML 디렉토리로 복사
COPY ./frontend/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]