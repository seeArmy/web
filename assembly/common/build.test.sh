#!/usr/bin/env bash


echo -e "\033[34m begin tar .... \033[0m"
rm -rf target/


TARGET_FOLDER=target/${GOOS}
TARGET_NAME=${TARGET_FOLDER}/${TARGET_EXEC_NAME}

go build -ldflags "-s -w" -i -o ${TARGET_NAME} ${BUILD_PACKAGE}
#go build -i -o ${TARGET_NAME} ${BUILD_PACKAGE}

version=`cat package.json |grep version | awk -F ':' '{print $2}' | awk -F '"' '{print $2}'`

TAR_NAME=${TARGET_EXEC_NAME}-${version}-`date "+%Y%m%d%H%M"`

mkdir -p ${TARGET_FOLDER}/${TAR_NAME}


SBIN_DIR=${TARGET_FOLDER}/${TAR_NAME}/sbin
BIN_DIR=${TARGET_FOLDER}/${TAR_NAME}
WEB_ROOT_DIR=${TARGET_FOLDER}/${TAR_NAME}/webroot

mkdir -p ${SBIN_DIR}
mkdir -p ${WEB_ROOT_DIR}

cp ${TARGET_NAME} ${SBIN_DIR}
cp -r assembly/bin ${BIN_DIR}
#cp -r profiles/${PROFILE}/* ${CONF_DIR}
cp -r dist/dev/* ${WEB_ROOT_DIR}


cd ${TARGET_FOLDER}

tar czf ${TAR_NAME}-${PROFILE}.tar.gz ${TAR_NAME}/*

echo -e "\033[34m build dev done.... \033[0m"

echo -e "\033[34m scp remote host [116.211.15.189]now.... \033[0m"

pwd

scp *.tar.gz root@116.211.15.189:/opt/app/zxweb/upload/

echo -e "\033[34m scp finished \033[0m"