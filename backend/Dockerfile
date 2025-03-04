# 애플리케이션 실행을 위한 JDK 11 이미지를 사용
FROM openjdk:11-jdk-slim

# 애플리케이션 JAR 파일 복사 (빌드된 파일은 GitHub Actions에서 처리)
COPY ./build/libs/*.jar app.jar

# 컨테이너 시작 시 Spring Boot 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

# 애플리케이션 포트 노출
EXPOSE 8080