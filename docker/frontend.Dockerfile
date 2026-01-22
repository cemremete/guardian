FROM nginx:alpine

# copy frontend files
COPY frontend/ /usr/share/nginx/html/

# copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
