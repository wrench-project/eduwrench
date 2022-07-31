cmake_minimum_required(VERSION 3.2)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project("thrustd")

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMakeModules/")

set(CMAKE_BUILD_TYPE Debug)

find_package(SimGrid REQUIRED)
find_package(Boost REQUIRED)


# include directories for dependencies and WRENCH libraries
include_directories(src/ ${SimGrid_INCLUDE_DIR} ${Boost_INCLUDE_DIR} /usr/local/include /opt/local/include /usr/local/include/wrench)

# source files
set(SOURCE_FILES
        src/ThrustDWMS.h
        src/ThrustDWMS.cpp
        src/ThrustDJobScheduler.h
        src/ThrustDJobScheduler.cpp
        src/ThrustDSimulator.cpp
       )

# script files
set(SCRIPT_FILES
        src/ThrustDJobScheduler.h
        src/ThrustDJobScheduler.cpp
        script/files_between_levels.cpp
        )

# test files
set(TEST_FILES
       )

# wrench library and dependencies
find_library(WRENCH_LIBRARY NAMES wrench)
find_library(WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY NAMES wrenchwfcommonsworkflowparser)
find_library(GTEST_LIBRARY NAMES gtest)

# generating the executable
add_executable(thrustd ${SOURCE_FILES})
add_executable(fbl ${SCRIPT_FILES})
set_property(TARGET thrustd PROPERTY CXX_STANDARD 14)


if (ENABLE_BATSCHED)
target_link_libraries(thrustd
                       ${WRENCH_LIBRARY}
                       ${WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY}
                       ${SimGrid_LIBRARY}
                      -lzmq )
target_link_libraries(fbl
                        ${WRENCH_LIBRARY}
                        ${WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY}
                        ${SimGrid_LIBRARY}
                        -lzmq )
else()
target_link_libraries(thrustd
                       ${WRENCH_LIBRARY}
                       ${WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY}
                       ${SimGrid_LIBRARY}
                      )
target_link_libraries(fbl
                        ${WRENCH_LIBRARY}
                        ${WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY}
                        ${SimGrid_LIBRARY}
                        )
endif()

install(TARGETS thrustd DESTINATION bin)
install(TARGETS fbl DESTINATION bin)

# generating unit tests
add_executable(unit_tests EXCLUDE_FROM_ALL
                   ${SOURCE_FILES}
                   ${TEST_FILES}
               )
target_link_libraries(unit_tests
                       ${GTEST_LIBRARY} wrench -lpthread -lm
                      )
