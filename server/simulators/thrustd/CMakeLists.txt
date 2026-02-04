cmake_minimum_required(VERSION 3.12)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project("thrustd")

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_CXX_STANDARD 17)
#set_property(TARGET thrustd PROPERTY CXX_STANDARD 17)


# Find Boost
if(POLICY CMP0167)
    cmake_policy(SET CMP0167 NEW)
endif()
find_package(Boost REQUIRED)
find_package(Boost COMPONENTS program_options REQUIRED)


set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMakeModules/")

set(CMAKE_BUILD_TYPE Debug)

# Find SimGrid
if (DEFINED SimGrid_PATH)
    if (NOT EXISTS "${SimGrid_PATH}")
        message(FATAL_ERROR "The specified SimGrid_PATH doesn't exit")
    else()
        file(GLOB LIBSIMGRID_FILES
                "${SimGrid_PATH}/lib/libsimgrid.so"
                "${SimGrid_PATH}/lib/libsimgrid.dylib"
        )
        if (NOT LIBSIMGRID_FILES)
            message(FATAL_ERROR "The specified SimGrid_PATH doesn't seem to contain a valid SimGrid installation")
        else()
            set(CMAKE_PREFIX_PATH ${SimGrid_PATH} ${CMAKE_PREFIX_PATH})
        endif()
    endif()
endif()
find_package(SimGrid REQUIRED)

# Find SimGrid's FS module
if (DEFINED FSMOD_PATH)
    if (NOT EXISTS "${FSMOD_PATH}")
        message(FATAL_ERROR "The specified FSMOD_PATH doesn't exit")
    else()
        file(GLOB LIBFSMOD_FILES
                "${FSMOD_PATH}/liblibfsmod.so"
                "${FSMOD_PATH}/lib/libfsmod.dylib"
        )
        if (NOT LIBFSMOD_FILES)
            message(FATAL_ERROR "The specified FSMOD_PATH doesn't seem to contain a valid FSMod installation")
        else()
            set(CMAKE_PREFIX_PATH ${FSMOD_PATH} ${CMAKE_PREFIX_PATH})
        endif()
    endif()
endif()
find_package(FSMod REQUIRED)

# Find WRENCH
if (DEFINED WRENCH_PATH)
    if (NOT EXISTS "${WRENCH_PATH}")
        message(FATAL_ERROR "The specified WRENCH_PATH doesn't exit")
    else()
        file(GLOB LIBWRENCH_FILES
                "${WRENCH_PATH}/lib/libwrench.a"
        )
        if (NOT LIBWRENCH_FILES)
            message(FATAL_ERROR "The specified WRENCH_PATH doesn't seem to contain a valid WRENCH installation")
        else()
            set(CMAKE_PREFIX_PATH ${WRENCH_PATH} ${CMAKE_PREFIX_PATH})
        endif()
    endif()
endif()
find_package(WRENCH REQUIRED)


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

# generating the executable
add_executable(thrustd ${SOURCE_FILES})
add_executable(fbl ${SCRIPT_FILES})


target_link_libraries(thrustd
                       ${WRENCH_LIBRARY}
                       ${WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY}
                       ${SimGrid_LIBRARY}
                       ${FSMOD_LIBRARY}
                      )
target_link_libraries(fbl
                        ${WRENCH_LIBRARY}
                        ${WRENCH_WFCOMMONS_WORKFLOW_PARSER_LIBRARY}
                        ${SimGrid_LIBRARY}
                        ${FSMOD_LIBRARY}
                        )

install(TARGETS thrustd DESTINATION bin)
install(TARGETS fbl DESTINATION bin)

