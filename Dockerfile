FROM mlisitsa/npmginx:latest

COPY . /tmp/networking-ui
WORKDIR /tmp/networking-ui

RUN npm install && \
    npm run build

RUN mkdir -p /usr/share/nginx/html/networking && cp -R dist/* /usr/share/nginx/html/networking

COPY default.conf /etc/nginx/conf.d/default.conf

ENV NODE_ENV production


EXPOSE 8080
