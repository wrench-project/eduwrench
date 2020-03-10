FROM wrenchproject/wrench:unstable

# install Node 10.x for the visualization
USER root
RUN apt update \
    && apt install -y curl \
    && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
    && apt-get install -y nodejs

RUN apt-get install -y ruby-full build-essential zlib1g-dev
RUN gem install jekyll bundler

USER wrench

WORKDIR /home/wrench/

# download eduWRENCH repository
RUN git clone https://github.com/wrench-project/eduwrench.git

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

EXPOSE 80

WORKDIR /home/wrench/eduwrench/server
CMD ["sh", "-c", "node /home/wrench/eduwrench/server/app.js && jekyll serve --source /home/wrench/eduwrench/web --port 80"]
