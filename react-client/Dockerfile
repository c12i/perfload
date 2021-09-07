FROM nginx:1.15-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build/ /usr/share/nginx/html

VOLUME /var/log/nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]