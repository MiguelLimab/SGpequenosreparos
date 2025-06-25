# Etapa 1: usa imagem oficial do Java 21
FROM eclipse-temurin:21-jdk

# Etapa 2: define o diretório de trabalho
WORKDIR /app

# Etapa 3: copia o JAR direto da raiz da pasta backend
COPY backend-0.0.1-SNAPSHOT.jar app.jar

# Etapa 4: expõe a porta definida no application.properties
EXPOSE 8081

# Etapa 5: executa o JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
