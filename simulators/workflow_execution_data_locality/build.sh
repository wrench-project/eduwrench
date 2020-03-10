cmake -DCMAKE_CXX_FLAGS="-DREMOTE_STORAGE" . && make clean && make && mv ./workflow_execution_data_locality_simulator ./workflow_execution_data_locality_simulator_remote_storage \
    && cmake -DCMAKE_CXX_FLAGS="-DLOCAL_STORAGE" . && make clean && make && mv ./workflow_execution_data_locality_simulator ./workflow_execution_data_locality_simulator_local_storage
    
