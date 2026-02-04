cmake_minimum_required(VERSION 3.12)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project(MASTER_WORKER_SIMULATOR)

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_CXX_STANDARD 17)

# Find Boost
if(POLICY CMP0167)
    cmake_policy(SET CMP0167 NEW)
endif()
find_package(Boost REQUIRED)
find_package(Boost COMPONENTS json program_options REQUIRED)


set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMakeModules/")

find_package(SimGrid REQUIRED)

# include directories for dependencies and WRENCH libraries
include_directories(src/ include/  /usr/local/include /usr/local/include/wrench /opt/local/include /opt/simgrid/include ${Boost_INCLUDE_DIR} ${SimGrid_INCLUDE_DIR})

# source files
set(SOURCE_FILES
        include/ActivityWMS.h
        include/ActivityScheduler.h
        src/ActivityWMS.cpp
        src/ActivityScheduler.cpp
        src/Simulator.cpp
        )

# wrench library and dependencies
find_library(WRENCH_LIBRARY NAMES libwrench.a wrench)
find_library(SimGrid_LIBRARY NAMES simgrid HINTS "/opt/simgrid/lib")
find_library(PUGIXML_LIBRARY NAMES pugixml)


add_executable(master_worker_simulator ${SOURCE_FILES})

target_link_libraries(master_worker_simulator
        ${WRENCH_LIBRARY}
        ${PUGIXML_LIBRARY}
        ${SimGrid_LIBRARY}
        )
