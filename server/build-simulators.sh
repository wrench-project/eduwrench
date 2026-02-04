#!/bin/bash
#
#  Usage  ./build.sh [-jX]
#  Example: ./build.sh -j10 (make will run with 10 threads)
#
set -e

# Get a numthreads argument (for parallel compilation)
# example: 4
if [ -z $1 ]
then
    makedashjarg="-j4"
else
    makedashjarg=$1
fi

# Colors
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

TOPDIR=`pwd`

# build simulators
printf "${CYAN}"
echo "COMPILING SIMULATORS"
printf "${NC}\n"

for  dir in `ls simulators/`; do
    
    echo "Building in simulator/$dir ..."
    cd simulators/$dir
    rm -rf ./build CMakeCache.txt 
    mkdir build
    cd build
    cmake -DCMAKE_CXX_FLAGS="-UDEBUG" ..
    make $makedashjarg
    cd $TOPDIR
done


