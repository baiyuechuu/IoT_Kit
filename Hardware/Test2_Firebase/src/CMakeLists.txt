# This file was automatically generated for projects
# without default 'CMakeLists.txt' file.

FILE(GLOB_RECURSE app_sources ${CMAKE_SOURCE_DIR}/src/*.*)

idf_component_register(
    SRCS "main.c"
    INCLUDE_DIRS "."
     EMBED_TXTFILES "../.pio/libdeps/esp32doit-devkit-v1/Lib_Firebase_FreeRTOS/firebase_root_cert.pem"
)
