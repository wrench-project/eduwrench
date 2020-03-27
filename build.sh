#!/bin/bash

# build simulators
echo "Compiling simulators"
cd simulators/networking_fundamentals && ./build.sh && cd ../..
cd simulators/multi_core_computing && ./build.sh && cd ../..
cd simulators/workflow_execution_fundamentals && ./build.sh && cd ../..
cd simulators/workflow_execution_data_locality && ./build.sh && cd ../..
cd simulators/workflow_execution_parallelism && ./build.sh && cd ../..
cd simulators/io_operations && ./build.sh && cd ../..

# copy dashboard scripts into web application
echo "Copying WRENCH dashboard scripts into web application"
ln -s /usr/local/wrench/dashboard web/public/sims/scripts/dashboard

# bundle install jekyll application
echo "Installing Jekyll application"
cd web && sudo bundle install && cd ..
