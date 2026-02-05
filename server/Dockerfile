#FROM ubuntu:focal
FROM node:16

USER root

# Point to Debian archive for EOL Buster
RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list

RUN apt-get update

# set timezone
RUN echo "America/Los_Angeles" > /etc/timezone && export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata

# build environment
RUN apt-get -y install pkg-config git cmake cmake-data graphviz libboost-all-dev wget sudo curl lcov default-jre flex bison doxygen

# install compiler
RUN apt-get -y install g++ gcc

#################################################
# WRENCH and its dependencies
#################################################

# set root's environment variable
ENV CXX="g++-8" CC="gcc-8"
WORKDIR /tmp

# install SimGrid 3.31 
RUN wget https://framagit.org/simgrid/simgrid/-/archive/v3.31/simgrid-v3.31.tar.gz && tar -xf simgrid-v3.31.tar.gz && cd simgrid-v3.31 && cmake . && make -j4 && sudo make install && cd .. && rm -rf simgrid-v3.31*

# install json for modern c++
RUN wget https://github.com/nlohmann/json/archive/refs/tags/v3.10.4.tar.gz && tar -xf v3.10.4.tar.gz && cd json-3.10.4 && cmake . && make -j4 && sudo make install && cd .. && rm -rf v3.10.4* json-3.10.4

# install WRENCH master:27083ee99f5961ec4bd6889fab3f01f53f447fa7
ENV WRENCH_VERSION="2.0"
RUN wget https://github.com/wrench-project/wrench/archive/v${WRENCH_VERSION}.tar.gz && tar -zxf v${WRENCH_VERSION}.tar.gz && cd wrench-${WRENCH_VERSION} && mkdir build && cd build && cmake .. && make -j6 && sudo make install  && cd ../.. && /bin/rm -rf wrench-${WRENCH_VERSION}
#RUN git clone https://github.com/wrench-project/wrench.git && cd wrench && git checkout 5729f4a50ea21465e8f49dca860c75ac8db45b54 && mkdir build && cd build && cmake .. && make -j4 && sudo make install && cd .. && cd .. && rm -rf wrench/ 


#################################################
# EDUWRENCH and its dependencies
#################################################

# install PUGIXML
RUN wget https://github.com/zeux/pugixml/releases/download/v1.12.1/pugixml-1.12.1.tar.gz && tar -xf pugixml-1.12.1.tar.gz && cd pugixml-1.12 && cmake . && make -j12 && sudo make install && cd .. && rm -rf pugixml-1.12*


# install Gatsby client
#RUN npm install -g gatsby-cli@4.23.0 --unsafe-perm

# Make wrench user sudoer
RUN useradd -ms /bin/bash wrench
RUN adduser wrench sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Copy files over
WORKDIR /home/wrench/
COPY . .

# Build the simulators
RUN sudo bash build-simulators.sh -j4

# set volume for data server
#RUN mkdir /home/wrench/data_server
#VOLUME /home/wrench/eduwrench/data_server

RUN npm install sqlite3 --save
RUN npm install
#RUN npm audit fix

#RUN npx knex migrate:latest
 
# Run the backend
CMD bash ./docker-server.sh
#CMD sleep 1000


