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
for  dir in `ls simulators/`; do
    echo "Building in simulator/$dir ..."
    cd simulators/$dir
    if [[ -f build.sh  ]]; then
        ./build.sh $makedashjarg
        if [[ $? -ne 0 ]]; then
            exit 1
        fi
    fi
    cd ../..
done

echo "Building server"
cd server && npm install && cd ..

echo "Building front-end"
cd web && npm install && gatsby build && cd ..
