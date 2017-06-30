FROM node:8.1.2-alpine
# debian

RUN set -xe \
    && apk add --update --no-cache nginx supervisor \
    && mkdir -p /var/app/zo-opgelost /var/log/supervisor /run/nginx/

WORKDIR /var/app/zo-opgelost
COPY client/dist/ /var/app/zo-opgelost/
COPY . /var/app/zo-opgelost/
COPY /var/app/zo-opgelost/assets/css/style.min.css /var/app/zo-opgelost/assets/css/style.css

COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord"]

