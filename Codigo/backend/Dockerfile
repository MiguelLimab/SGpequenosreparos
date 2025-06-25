# Etapa 1: usa imagem oficial do Java 21
FROM eclipse-temurin:21-jdk

# Etapa 2: define o diretório de trabalho
WORKDIR /app

# Etapa 3: copia o JAR gerado localmente para o container
COPY backend-0.0.1-SNAPSHOT.jar app.jar

# Etapa 4: expõe a porta 8080 (onde o Spring Boot roda)
EXPOSE 8081

# Etapa 5: define o comando de execução do JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
