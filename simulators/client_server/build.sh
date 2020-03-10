cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make && mv ./client_server_simulator ./client_server_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make
