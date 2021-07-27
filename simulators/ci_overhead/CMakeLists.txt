cmake_minimum_required(VERSION 3.2)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project(CI_OVERHEAD_SIMULATOR)

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_CXX_STANDARD 14)

find_package(Boost REQUIRED)

# include directories for dependencies and WRENCH libraries
include_directories(src/ include/ /usr/local/include /usr/local/include/wrench /opt/local/include /opt/simgrid/include ${Boost_INCLUDE_DIR})

# source files
set(SOURCE_FILES
        include/ActivityWMS.h
        src/ActivityWMS.cpp
        src/Simulator.cpp
        )

# wrench library and dependencies
find_library(WRENCH_LIBRARY NAMES libwrench.a wrench)
find_library(SIMGRID_LIBRARY NAMES simgrid)
find_library(PUGIXML_LIBRARY NAMES pugixml)

add_executable(ci_overhead_simulator ${SOURCE_FILES})
target_link_libraries(ci_overhead_simulator
        ${WRENCH_LIBRARY}
        ${SIMGRID_LIBRARY}
        ${PUGIXML_LIBRARY}
        )
