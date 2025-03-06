FROM openjdk:11-jdk-slim


COPY build/libs/*.jar app.jar


ENTRYPOINT ["java", "Dspring.profiles.active=dev", "-jar", "/app.jar"]
