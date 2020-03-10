FROM wrenchproject/wrench:1.5

# install Node 10.x for the visualization
USER root
RUN sudo apt update \
    && sudo apt install -y curl \
    && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
    && sudo apt-get install -y nodejs

USER wrench

WORKDIR /home/wrench/

# download eduWRENCH repository
RUN git clone https://github.com/wrench-project/eduwrench.git

#COPY keys.js /home/wrench/wrench-pedagogic-modules/visualization/keys.js

#RUN chown -R wrench ./wrench-pedagogic-modules

# build binaries for each activity
#WORKDIR /home/wrench/wrench-pedagogic-modules/simulations

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

EXPOSE 80

#WORKDIR /home/wrench/wrench-pedagogic-modules/visualization
#CMD ["node", "app.js"]
