FROM node:6

RUN echo 'deb http://ftp.us.debian.org/debian testing main contrib non-free' > /etc/apt/sources.list.d/gcc.list
RUN echo 'Package: *' > /etc/apt/preferences.d/gcc
RUN echo 'Pin: release a=testing' >> /etc/apt/preferences.d/gcc
RUN echo 'Pin-Priority: 100' >> /etc/apt/preferences.d/gcc

RUN apt-get update

RUN apt-get install -y -t testing gcc

COPY ./app /usr/src/app

ENTRYPOINT ["node",  "server.js"]

EXPOSE 80

WORKDIR /usr/src/app
