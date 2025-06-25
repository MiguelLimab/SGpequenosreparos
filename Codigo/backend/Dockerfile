FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copia o JAR gerado para dentro do container
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Define o perfil ativo como railway
ENV SPRING_PROFILES_ACTIVE=railway

# Expõe a porta correta
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
