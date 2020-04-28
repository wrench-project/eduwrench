#!/bin/bash
makearg=$1
cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make $makearg && mv ./multi_core_simulator ./multi_core_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make $makearg
