cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make && mv ./io_simulator ./io_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make
