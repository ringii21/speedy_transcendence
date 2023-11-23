FROM        node:lts AS build

WORKDIR     /app

RUN         apt-get install -y && \
            npm install -g npm@latest

COPY        package*.json .

RUN         npm install

COPY        . .

RUN         npm run build

CMD         [ "npm", "run", "build" ]

FROM        nginx:latest

COPY        ./conf/default.conf ./etc/nginx/http.d/default.conf
COPY        ./conf/nginx.conf ./etc/nginx/nginx.conf
COPY        --from=build /app/build /usr/share/nginx/html

EXPOSE      8080
