cmake_minimum_required(VERSION 3.2)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project(ACTIVITY_MULTI_CORE_COMPUTING)

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_CXX_STANDARD 14)

# include directories for dependencies and WRENCH libraries
include_directories(src/ include/ /usr/local/include /usr/local/include/wrench /opt/local/include)

# source files
set(SOURCE_FILES
include/ActivityWMS.h
src/ActivityWMS.cpp
include/ActivityScheduler.h
src/ActivityScheduler.cpp
src/Simulator.cpp
)

# wrench library and dependencies
find_library(WRENCH_LIBRARY NAMES wrench)
find_library(SIMGRID_LIBRARY NAMES simgrid)
find_library(PUGIXML_LIBRARY NAMES pugixml)

add_executable(multi_core_simulator ${SOURCE_FILES})
target_link_libraries(multi_core_simulator
${WRENCH_LIBRARY}
${SIMGRID_LIBRARY}
${PUGIXML_LIBRARY}
)
