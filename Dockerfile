FROM wrenchproject/wrench:unstable

# install Node 10.x for the visualization
USER root
RUN apt update \
    && apt install -y curl \
    && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
    && apt-get install -y nodejs ruby-full build-essential zlib1g-dev

RUN gem install jekyll bundler
RUN echo "wrench ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER wrench

WORKDIR /home/wrench/

# download eduWRENCH repository
RUN git clone https://github.com/wrench-project/eduwrench.git

# bundle install jekyll application
WORKDIR /home/wrench/eduwrench/web
RUN sudo bundle install

COPY keys.js /home/wrench/eduwrench/server/keys.js

# build binaries for each activity simulator
WORKDIR /home/wrench/eduwrench/simulators

#RUN cd networking_fundamentals \
#    && ./build.sh

#RUN cd multi_core_computing \
#    && ./build.sh

#RUN cd workflow_execution_fundamentals \
#    && ./build.sh

#RUN cd workflow_execution_data_locality \
#    && ./build.sh

#RUN cd workflow_execution_parallelism \
#    && ./build.sh

RUN cd io_operations \
    && ./build.sh

# run applications
WORKDIR /home/wrench/eduwrench/web
CMD ["sh", "-c", "bundle exec jekyll serve -H 0.0.0.0 -P 4000 -B && node /home/wrench/eduwrench/server/app.js"]
