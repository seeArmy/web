#!/bin/bash

set -e

export GOOS=linux
export GOARCH=amd64

PROFILE=test-live

PROJECT_HOME=`pwd`

if [ -f "${PROJECT_HOME}/assembly/common/app.properties" ]; then
. ${PROJECT_HOME}/assembly/common/app.properties
fi


if [ -f "${PROJECT_HOME}/assembly/common/build.test.live.sh" ]; then
. ${PROJECT_HOME}/assembly/common/build.test.live.sh
fi

