FROM ubuntu:focal

USER root

RUN apt-get update

# set timezone
RUN echo "America/Los_Angeles" > /etc/timezone && export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata

# build environment
RUN apt-get -y install pkg-config git cmake cmake-data graphviz libboost-all-dev wget sudo curl lcov default-jre flex bison doxygen

# install compiler
RUN apt-get -y install g++ gcc

# install Node and Gatsby client
RUN apt-get upgrade ca-certificates -y
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
RUN npm install -g gatsby-cli@4.23.0 --unsafe-perm

# Make wrench user sudoer
RUN useradd -ms /bin/bash wrench
RUN adduser wrench sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /home/wrench

# Copy files over
COPY . .
RUN /bin/rm -rf .cache ./src/public

#CMD gatsby develop -H 0.0.0.0 -p 4000
CMD ["sh", "-c", "npm install && npm audit fix && gatsby develop"]
