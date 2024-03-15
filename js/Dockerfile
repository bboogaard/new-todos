FROM nginx:stable-alpine

COPY ./build /usr/share/nginx/html
COPY ./nginx /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]