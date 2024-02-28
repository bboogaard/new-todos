FROM nginx:stable-alpine

COPY ./src /usr/share/nginx/html
COPY ./src/nginx /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]