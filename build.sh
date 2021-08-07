#!/bin/bash

#
#  Usage  ./build.sh [-jX]
#  Example: ./build.sh -j10 (make will run with 10 threads)
#

# Get a numthreads argument (for parallel compilation)
# example: 4
if [ -z $1 ]
then
    makedashjarg="-j2"
else
    makedashjarg=$1
fi

# Colors
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

printf "${ORANGE}"
echo "======================================"
echo "  eduWRENCH - Build"
echo "======================================"
printf "\n${NC}"

# build simulators
printf "${CYAN}"
echo "[1/3] COMPILING SIMULATORS"
printf "${NC}\n"

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

printf "${CYAN}\n"
echo "[2/3] BUILDING SERVER"
printf "${NC}\n"
mkdir db
cd server && npm install && npm audit fix && npx knex migrate:latest && cd ..

printf "${CYAN}\n"
echo "[3/3] BULDING FRONT-END"
printf "${NC}\n"
cd web && npm install && gatsby build && cd ..
