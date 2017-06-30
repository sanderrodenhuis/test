FROM node:8.1.2-alpine
# debian

RUN set -xe \
    && export DEBIAN_FRONTEND="noninteractive" \
    && apt-get update \
    && apt-get install -y nginx

# supervisor to run some (node+nginx)
RUN set -xe \
    && export DEBIAN_FRONTEND="noninteractive" \
    && apt-get install -y supervisor\
    && mkdir -p /var/app/zo-opgelost /var/log/supervisor

WORKDIR /var/app/zo-opgelost
COPY . /var/app/zo-opgelost/
#RUN npm install -g gulp && npm install && gulp --production
RUN npm start

COPY nginx-default.conf /etc/nginx/sites-available/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80 443 1443
CMD ["/usr/bin/supervisord"]

