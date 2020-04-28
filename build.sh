#!/bin/bash
#
#  Usage  ./build.sh [-jX]
#  Example: ./build.sh -j10 (make will run with 10 threads)
#      

# Get a numthreads argument (for parallel compilation)
# example: 4
if [ -z $1 ]
then
    makedashjarg="-j1"
else
    makedashjarg=$1
fi

# build simulators
echo "Compiling simulators"
cd simulators/networking_fundamentals && ./build.sh $makedashjarg && cd ../..
cd simulators/multi_core_computing_independent_tasks && ./build.sh $makedashjarg && cd ../..
cd simulators/workflow_execution_fundamentals && ./build.sh $makedashjarg && cd ../..
cd simulators/workflow_execution_data_locality && ./build.sh $makedashjarg && cd ../..
cd simulators/workflow_execution_parallelism && ./build.sh $makedashjarg && cd ../..
cd simulators/io_operations && ./build.sh $makedashjarg && cd ../..

# copy dashboard scripts into web application
echo "Copying WRENCH dashboard scripts into web application"
ln -s /usr/local/wrench/dashboard web/public/sims/scripts/dashboard

# bundle install jekyll application
echo "Installing Jekyll application"
cd web && sudo bundle install && cd ..
