cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make && mv ./master_worker_simulator ./master_worker_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make
