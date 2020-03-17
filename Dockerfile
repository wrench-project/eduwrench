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

# set volume for data server
RUN mkdir /home/wrench/eduwrench/data_server
VOLUME /home/wrench/eduwrench/data_server

# run build script
WORKDIR /home/wrench/eduwrench
RUN bash build.sh

# run applications
WORKDIR /home/wrench/eduwrench/web
CMD ["sh", "-c", "bundle exec jekyll serve -H 0.0.0.0 -P 4000 -B && node /home/wrench/eduwrench/server/app.js"]
