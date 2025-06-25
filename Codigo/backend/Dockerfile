# Etapa 1: usa imagem oficial do Java 21
FROM eclipse-temurin:21-jdk

# Etapa 2: define o diretório de trabalho
WORKDIR /app

# Etapa 3: copia o JAR gerado pelo Maven para dentro do container
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Etapa 4: expõe a porta (ajuste se necessário)
EXPOSE 8081

# Etapa 5: define o comando de execução do JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
