# Nginx 설정 파일을 복사
FROM nginx:alpine

# Nginx 설정 파일 복사 (GitHub Actions에서 빌드된 React 파일을 복사)
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Nginx의 HTML 폴더에 빌드된 React 애플리케이션을 복사
COPY --from=react-build /build /usr/share/nginx/html

# Nginx 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]