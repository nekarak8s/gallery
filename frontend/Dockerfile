# Step 1: build the React
FROM node:18-slim AS build-stage

# Add curl for healthcheck
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install packages
COPY package*.json .
RUN npm install

# Copy source code & build
COPY . .
RUN npm run build

# Step2: Add nginx
FROM nginx:alpine

# Copty the build file from the previous sstep
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Replace the nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]