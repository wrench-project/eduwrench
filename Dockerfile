FROM ubuntu:focal

USER root

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
ENV CXX="g++-9" CC="gcc-9"
WORKDIR /tmp

# install SimGrid 3.31 
RUN wget https://framagit.org/simgrid/simgrid/-/archive/v3.31/simgrid-v3.31.tar.gz && tar -xf simgrid-v3.31.tar.gz && cd simgrid-v3.31 && cmake . && make -j4 && sudo make install && cd .. && rm -rf simgrid-v3.31*

# install json for modern c++
RUN wget https://github.com/nlohmann/json/archive/refs/tags/v3.10.4.tar.gz && tar -xf v3.10.4.tar.gz && cd json-3.10.4 && cmake . && make -j4 && sudo make install && cd .. && rm -rf v3.10.4* json-3.10.4

# install WRENCH master:27083ee99f5961ec4bd6889fab3f01f53f447fa7
RUN git clone https://github.com/wrench-project/wrench.git && cd wrench && git checkout 27083ee99f5961ec4bd6889fab3f01f53f447fa7 && mkdir build && cd build && cmake .. && make -j4 && sudo make install && cd .. && cd .. && rm -rf wrench/ 

#################################################
# EDUWRENCH and its dependencies
#################################################

# install PUGIXML
RUN wget https://github.com/zeux/pugixml/releases/download/v1.12.1/pugixml-1.12.1.tar.gz && tar -xf pugixml-1.12.1.tar.gz && cd pugixml-1.12 && cmake . && make -j12 && sudo make install && cd .. && rm -rf pugixml-1.12*

# install Node and Gatsby client
RUN apt-get upgrade ca-certificates -y
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
RUN npm install -g gatsby-cli --unsafe-perm

# Make wrench user sudoer
RUN useradd -ms /bin/bash wrench
RUN adduser wrench sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER wrench
WORKDIR /home/wrench/


# download eduWRENCH repository
RUN git clone https://github.com/wrench-project/eduwrench.git
RUN cd eduwrench && git checkout

# set volume for data server
RUN mkdir /home/wrench/eduwrench/data_server
VOLUME /home/wrench/eduwrench/data_server

# run build script
WORKDIR /home/wrench/eduwrench
RUN mkdir db
RUN bash build.sh -j2

# run applications
WORKDIR /home/wrench/eduwrench
USER root
COPY ./docker.sh .
RUN chown wrench:users docker.sh

USER wrench
CMD ./docker.sh
