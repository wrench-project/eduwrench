cmake_minimum_required(VERSION 3.2)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project(ACTIVITY_IO_OPERATIONS)

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_CXX_STANDARD 14)

find_package(Boost REQUIRED)

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMakeModules/")

find_package(SimGrid REQUIRED)

# include directories for dependencies and WRENCH libraries
include_directories(src/ include/  /usr/local/include /usr/local/include/wrench /opt/local/include /opt/simgrid/include ${Boost_INCLUDE_DIR} ${SimGrid_INCLUDE_DIR})

# CHANGE ALL
set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH} /opt/simgrid/lib)

# source files
set(SOURCE_FILES
        include/ActivityWMS.h
        src/ActivityWMS.cpp
        src/Simulator.cpp
        )

# wrench library and dependencies
find_library(WRENCH_LIBRARY NAMES wrench)
find_library(SimGrid_LIBRARY NAMES simgrid HINTS "/opt/simgrid/lib")
find_library(PUGIXML_LIBRARY NAMES pugixml)

add_executable(io_simulator ${SOURCE_FILES})
target_link_libraries(io_simulator
        ${WRENCH_LIBRARY}
        ${SimGrid_LIBRARY}
        ${PUGIXML_LIBRARY}
        )
