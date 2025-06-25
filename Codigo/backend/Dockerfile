# Etapa 1: imagem com Maven + JDK para build
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Compila o projeto e gera o JAR
RUN mvn clean package -DskipTests

# Etapa 2: imagem menor apenas com o JDK para rodar o app
FROM eclipse-temurin:21-jdk

# Define o diretório de trabalho no container final
WORKDIR /app

# Copia o JAR gerado na etapa de build
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta definida
EXPOSE 8081

# Executa o JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
