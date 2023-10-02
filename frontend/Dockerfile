# Step2: Add nginx
FROM nginx:alpine

# Copty the build file from the previous sstep
COPY ./dist /usr/share/nginx/html

# Replace the nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]