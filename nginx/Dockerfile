FROM ubuntu:latest

MAINTAINER Henri Casanova <henric@hawaii.edu>

# update repositories
RUN apt update

# set timezone to Hawaii
RUN echo "Pacific/Honolulu" > /etc/timezone && export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata

# install nginx
RUN apt -y install nginx

# install basic things
RUN apt -y install vim
RUN apt -y install wget
RUN apt -y install inetutils-ping
RUN apt -y install curl

# Copy nginx custom config file
ARG PORT
ARG SERVER_NAME

COPY custom-nginx-locations-common.conf /etc/nginx/custom-nginx-locations-common.conf
COPY custom-nginx-port-${PORT}.conf /etc/nginx/custom-nginx.conf
RUN sed -i "s/SERVER_NAME/${SERVER_NAME}/g" /etc/nginx/custom-nginx.conf

# Start nginx 
EXPOSE $PORT
STOPSIGNAL SIGQUIT
#CMD ["sleep", "10000"]
CMD ["nginx", "-c", "/etc/nginx/custom-nginx.conf", "-g", "daemon off;"]



