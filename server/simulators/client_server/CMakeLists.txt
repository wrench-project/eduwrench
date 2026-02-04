cmake_minimum_required(VERSION 3.12)
message(STATUS "Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}")

project(CLIENT_SERVER_SIMULATOR)

add_definitions("-Wall -Wno-unused-variable -Wno-unused-private-field")

set(CMAKE_CXX_STANDARD 17)

# Find Boost
if(POLICY CMP0167)
    cmake_policy(SET CMP0167 NEW)
endif()
find_package(Boost REQUIRED)
find_package(Boost COMPONENTS json program_options REQUIRED)


set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMakeModules/")

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
include_directories(src/ include/  /usr/local/include /usr/local/include/wrench /opt/local/include /opt/simgrid/include ${Boost_INCLUDE_DIR} ${SimGrid_INCLUDE_DIR})

# source files
set(SOURCE_FILES
        include/ActivityWMS.h
        src/ActivityWMS.cpp
        src/Simulator.cpp
        )

find_library(PUGIXML_LIBRARY NAMES pugixml)

add_executable(client_server_simulator ${SOURCE_FILES})
target_link_libraries(client_server_simulator
        ${WRENCH_LIBRARY}
        ${PUGIXML_LIBRARY}
        ${SimGrid_LIBRARY}
        ${FSMOD_LIBRARY}
        )
