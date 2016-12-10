# Matias Carrasco Kind
FROM ubuntu:14.04
MAINTAINER Matias Carrasco Kind <mgckind@gmail.com>
MAINTAINER Matias Carrasco Kind <mgckind@gmail.com>

ENV HOME /root
ENV SHELL /bin/bash

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y git nano git curl nano wget dialog net-tools build-essential vim unzip libaio1
RUN apt-get install -y python
RUN apt-get install -y  python-pip python-dev build-essential
RUN apt-get install -y python-numpy python-matplotlib python-scipy

RUN pip install --upgrade pip

RUN apt-get install -y build-essential openssl libssl-dev pkg-config
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y graphviz
RUN sudo apt-get install -y g++ flex bison gperf ruby perl libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev libpng-dev libjpeg-dev  libx11-dev libxext-dev

RUN apt-get install nodejs-legacy

#Phantom.js
RUN git clone git://github.com/ariya/phantomjs.git
RUN cd /phantomjs
WORKDIR /phantomjs
RUN git checkout 2.0
RUN ./build.sh --confirm


RUN cp /phantomjs/bin/phantomjs /usr/bin/phantomjs
EXPOSE 80

RUN mkdir -p /test
WORKDIR /test
RUN cd /test

RUN echo 'new'

RUN git clone https://github.com/mgckind/GraphMaker.git 
WORKDIR /test/GraphMaker
RUN cd /test/GraphMaker
RUN cd /test/GraphMaker/test_socket
WORKDIR /test/GraphMaker/test_socket
RUN npm install 


