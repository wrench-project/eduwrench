#!/bin/bash
makearg=$1
cmake . && make clean && make $makearg
