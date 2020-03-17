#!/bin/bash

# build simulators
cd simulators/networking_fundamentals && ./build.sh && cd ../..
cd simulators/multi_core_computing && ./build.sh && cd ../..
cd simulators/workflow_execution_fundamentals && ./build.sh && cd ../..
cd simulators/workflow_execution_data_locality && ./build.sh && cd ../..
# cd simulators/workflow_execution_parallelism && ./build.sh && cd ../..
cd simulators/io_operations && ./build.sh && cd ../..

# copy dashboard scripts into web application
cp -R /usr/local/wrench/dashboard web/public/sims/scripts/

# bundle install jekyll application
cd web && sudo bundle install && cd ..
