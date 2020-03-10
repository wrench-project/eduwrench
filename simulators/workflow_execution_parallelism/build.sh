cmake -DCMAKE_CXX_FLAGS="-DDEBUG" . && make clean && make && mv ./workflow_execution_parallelism_simulator ./workflow_execution_parallelism_simulator_debug \
    && cmake -DCMAKE_CXX_FLAGS="-UDEBUG" . && make clean && make
