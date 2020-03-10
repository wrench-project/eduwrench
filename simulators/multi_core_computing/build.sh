cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make && mv ./multi_core_simulator ./multi_core_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make
