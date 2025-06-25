# Etapa 1: Build com Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build

# Copia tudo e instala as dependências
COPY . .

RUN mvn clean package -DskipTests

# Etapa 2: Runtime com JDK apenas
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copia apenas o jar final da etapa anterior
COPY --from=builder /build/target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/backend.jar"]
