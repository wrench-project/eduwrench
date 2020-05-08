#!/bin/bash
makearg=$1
cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make $makearg

