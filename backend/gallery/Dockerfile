# 기반 이미지 선택
# FROM adoptopenjdk:11-jre-hotspot
FROM openjdk:11

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 생성
WORKDIR /app

# 빌드된 JAR 파일을 Docker 이미지 내 /app 디렉토리로 복사
COPY build/libs/gallery-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8002

# JAR 파일 실행
CMD ["java", "-jar", "app.jar"]