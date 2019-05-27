#!/bin/bash

set -e

export GOOS=darwin
export GOARCH=amd64

PROFILE=test

PROJECT_HOME=`pwd`

if [ -f "${PROJECT_HOME}/assembly/common/app.properties" ]; then
. ${PROJECT_HOME}/assembly/common/app.properties
fi


if [ -f "${PROJECT_HOME}/assembly/common/build.test.sh" ]; then
. ${PROJECT_HOME}/assembly/common/build.test.sh
fi

