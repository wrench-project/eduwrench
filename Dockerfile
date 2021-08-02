FROM wrenchproject/wrench:unstable

# install Node and Gatsby client
USER root

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
RUN npm install -g gatsby-cli --unsafe-perm

USER wrench
WORKDIR /home/wrench/

# download eduWRENCH repository
RUN git clone https://github.com/wrench-project/eduwrench.git
RUN cd eduwrench && git checkout gatsby_clean

# set volume for data server
RUN mkdir /home/wrench/eduwrench/data_server
VOLUME /home/wrench/eduwrench/data_server

# run build script
WORKDIR /home/wrench/eduwrench
RUN bash build.sh -j 2

# run applications
WORKDIR /home/wrench/eduwrench/web
USER root
COPY ./docker.sh .
RUN chown wrench:users docker.sh

USER wrench
CMD ./docker.sh
