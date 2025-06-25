# Etapa 1: imagem base com Java 21
FROM eclipse-temurin:21-jdk

# Etapa 2: define o diretório de trabalho
WORKDIR /app

# Etapa 3: copia o JAR da raiz do repositório para o container
COPY backend-0.0.1-SNAPSHOT.jar app.jar

# Etapa 4: define a porta exposta
EXPOSE 8081

# Etapa 5: executa a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
