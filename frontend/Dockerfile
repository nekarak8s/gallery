# Step1: Build react app
FROM node:18 AS build-stage

# Make working directory & install dependencies
WORKDIR /app
COPY package*.json .
RUN npm install

# Copy sousrce
COPY . .
RUN npm run build

# Step2: Serve build file with Nginx
FROM nginx:alpine

# Get previous step's build file
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Replace to custom nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Expose as 80 port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]