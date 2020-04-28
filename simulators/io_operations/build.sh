#!/bin/bash
makearg=$1
cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make $makearg && mv ./io_simulator ./io_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make $makearg
