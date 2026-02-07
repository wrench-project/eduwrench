FROM ubuntu:latest

USER root

RUN apt-get update

# set timezone
RUN echo "America/Los_Angeles" > /etc/timezone && export DEBIAN_FRONTEND=noninteractive && apt-get install -y tzdata

# build environment
RUN apt-get -y install pkg-config git cmake cmake-data graphviz libboost-all-dev wget sudo curl lcov default-jre flex bison doxygen

# install Node and Gatsby client
RUN apt-get upgrade ca-certificates -y
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs

# install compiler
RUN apt-get -y install g++ gcc

#################################################
# WRENCH and its dependencies
#################################################

# set root's environment variable
ENV CXX="g++" CC="gcc"
WORKDIR /tmp

# install SimGrid
RUN wget --no-check-certificate https://github.com/simgrid/simgrid/releases/download/v4.1/simgrid-4.1.tar.gz && tar -xf simgrid-4.1.tar.gz && cd simgrid-4.1 && cmake . && make -j8  && sudo make install && cd .. && rm -rf simgrid-4.1*
#RUN git clone https://framagit.org/simgrid/simgrid.git && cd simgrid && git checkout 1f1b85861ea71dd27d362b70f268b580c1f8c7c4 && mkdir build && cd build && cmake .. && make && sudo make install

# install SimGrid's FSMod
RUN wget https://github.com/simgrid/file-system-module/archive/refs/tags/v0.4.tar.gz && tar -xf v0.4.tar.gz && cd file-system-module-0.4 && mkdir build && cd build && cmake .. && make -j8  && sudo make install && cd ../.. && rm -rf v0.4.tar.gz file-system-module-v*

# install json for modern c++
RUN wget https://github.com/nlohmann/json/archive/refs/tags/v3.11.3.tar.gz && tar -xf v3.11.3.tar.gz && cd json-3.11.3 && cmake . && make -j8 && sudo make install && cd .. && rm -rf v3.11.3* json-3.11.3

# install swagger-codegen stuff
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip3 install jsonref --break-system-packages
RUN apt-get install -y libasio-dev

# install WRENCH
ENV WRENCH_VERSION="2.8"
RUN wget https://github.com/wrench-project/wrench/archive/v${WRENCH_VERSION}.tar.gz && tar -zxf v${WRENCH_VERSION}.tar.gz && cd wrench-${WRENCH_VERSION} && mkdir build && cd build && cmake .. && make -j8 wrench-daemon examples && sudo make install && cd ../.. && /bin/rm -rf wrench-${WRENCH_VERSION}




#################################################
# EDUWRENCH and its dependencies
#################################################

# install PUGIXML
RUN wget https://github.com/zeux/pugixml/releases/download/v1.12.1/pugixml-1.12.1.tar.gz && tar -xf pugixml-1.12.1.tar.gz && cd pugixml-1.12 && cmake . && make -j8 && sudo make install && cd .. && rm -rf pugixml-1.12*


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


