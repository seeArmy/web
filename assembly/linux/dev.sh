#!/usr/bin/env bash

set -e

export GOOS=linux
export GOARCH=amd64

PROFILE=dev

PROJECT_HOME=`pwd`

if [ -f "${PROJECT_HOME}/assembly/common/app.properties" ]; then
. ${PROJECT_HOME}/assembly/common/app.properties
fi



if [ -f "${PROJECT_HOME}/assembly/common/build.dev.sh" ]; then
. ${PROJECT_HOME}/assembly/common/build.dev.sh
fi
