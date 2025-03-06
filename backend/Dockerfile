# 애플리케이션 실행을 위한 JDK 11 이미지를 사용
FROM openjdk:11-jdk-slim

# 빌드된 JAR 파일을 컨테이너로 복사
COPY build/libs/*.jar app.jar

# 컨테이너 시작 시 Spring Boot 애플리케이션 실행
ENTRYPOINT ["java", "Dspring.profiles.active=dev", "-jar", "/app.jar"]
