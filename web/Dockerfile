FROM ubuntu:latest

USER root

RUN apt-get update

# set timezone
RUN echo "America/Los_Angeles" > /etc/timezone && export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata

# build environment
RUN apt-get -y install pkg-config git cmake cmake-data graphviz libboost-all-dev wget sudo curl lcov default-jre flex bison doxygen make

# install compiler
RUN apt-get -y install g++ gcc

# install Node and Gatsby client
RUN apt-get upgrade ca-certificates -y
RUN apt-get install -y curl python3 python3-setuptools
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs
RUN npm install -g gatsby-cli@4.23.0 --unsafe-perm

# Make wrench user sudoer
RUN useradd -ms /bin/bash wrench
RUN adduser wrench sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /home/wrench
USER wrench

# Copy files over
COPY --chown=wrench:wrench . .
RUN /bin/rm -rf .cache ./src/public

#CMD gatsby develop -H 0.0.0.0 -p ${EDUWRENCH_FRONTEND_PORT}
CMD ["sh", "-c", "npm install --legacy-peer-deps --unsafe-perm && gatsby develop -p ${EDUWRENCH_FRONTEND_PORT} -H 0.0.0.0"]
#CMD sleep 1000000
