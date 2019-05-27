pipeline {
    agent {
        label "${JENKINS_SLAVE_NODE}"
    }

    stages {
        // Clean up previous code
        stage("clean up previous code") {
            steps {
                dir("${WORKSPACE}"){
                    deleteDir()
                }  
            }
        }
        // Get code from gitlab
        stage('Git Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '${Branch}']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'b0031a42-4217-433e-b469-7263d8632b77', url: 'http://192.168.1.93/application/rltx-webpack.git']]])
                }
            }
        // Code Maven build
        stage('Maven Build') {
            steps {
                sh '''
                rm -rf ${WORKSPACE}/dist/${PROJECT_ENV}
                rm -rf ${WORKSPACE}/api/fieldMetadata/fieldMetadata.tar.gz
                npm install
                npm run build ${PROJECT_ENV}=${GATEWAY_STRING}
                '''
            }        
        }

        stage('Package to tar') {
            steps {
                sh '''
                cd ${WORKSPACE}/dist/${PROJECT_ENV}
                tar zcf webpack-${REMOTE_NAME}.tar.gz ./*
            '''
            }
        }

        // upload webpack package to OSS 
        stage('upload to OSS') {
            steps {
            sh '''
            cd /deploy/tools/OSS_Python_API && /usr/bin/python osscmd mkdir oss://rlbackup/${OSS_DIR_PROD}/${REMOTE_NAME} && /usr/bin/python osscmd put ${WORKSPACE}/dist/${PROJECT_ENV}/webpack-${REMOTE_NAME}.tar.gz oss://rlbackup/${OSS_DIR_PROD}/${REMOTE_NAME}/
            '''
            }
        }

        stage('Upload webpack-api to OSS') {
            steps {
                sh '''
                cd ${WORKSPACE}/api/fieldMetadata/
                tar zcf fieldMetadata.tar.gz ./*
                sleep 3
                cd /deploy/tools/OSS_Python_API
                /usr/bin/python osscmd put ${WORKSPACE}/api/fieldMetadata/fieldMetadata.tar.gz oss://rlbackup/${OSS_DIR_PROD}/webpack-${REMOTE_NAME}-api/
            '''
            }
        }

        // Deploy application to Remote Host
        stage('Deploy to Remote Host') {
            steps {
                script {
                    if ("${REMOTE_NAME}" == 'development-web') {
                        REMOTE_HOST = 'development-web-ip'
                        REMOTE_USER_ID = 'development_db_user'
                        GATEWAY_STRING = '开发环境&gatewayUrl=http://gateway-qlh.rltx.xyz'
                    } else if ("${REMOTE_NAME}" == 'staging-web') {
                        REMOTE_HOST = 'staging-web-ip'                        
                        REMOTE_USER_ID = 'staging-host-appuser'
                        GATEWAY_STRING = '预发布&gatewayUrl=https://rltx2-yfb-gateway.rltx.com'
                    } else if ("${REMOTE_NAME}" == 'yanshi-web') {
                        REMOTE_HOST = 'yanshi-web-ip'
                        REMOTE_USER_ID = 'yanshi-host-appuser'
                    } else if ("${REMOTE_NAME}" == 'huaneng-test-web') {
                        REMOTE_HOST = 'huaneng-test-web-ip'
                        REMOTE_USER_ID = 'huaneng-test-host-appuser'
                        GATEWAY_STRING = '华能测试&gatewayUrl=https://hnenggateway.rltx.com'
                     } else if ("${REMOTE_NAME}" == 'huaneng-web') {
                        REMOTE_HOST = 'huaneng-web-ip'
                        REMOTE_USER_ID = 'huaneng-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'anruilong-web') {
                        REMOTE_HOST = 'anruilong-web-ip'
                        REMOTE_USER_ID = 'anruilong-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'dfxw-web') {
                        REMOTE_HOST = 'dfxw-web-ip'
                        REMOTE_USER_ID = 'dfxw-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'haotian-web') {
                        REMOTE_HOST = 'haotian-web-ip'
                        REMOTE_USER_ID = 'haotian-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'xintai-web') {
                        REMOTE_HOST = 'xintai-web-ip'
                        REMOTE_USER_ID = 'xintai-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'jianhua-web') {
                        REMOTE_HOST = 'jianhua-web-ip'
                        REMOTE_USER_ID = 'jianhua-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'jiuzhou-web') {
                        REMOTE_HOST = 'jiuzhou-web-ip'
                        REMOTE_USER_ID = 'jiuzhou-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'lianyungang-web') {
                        REMOTE_HOST = 'lianyungang-web-ip'
                        REMOTE_USER_ID = 'lianyungang-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'ltja-web') {
                        REMOTE_HOST = 'ltja-web-ip'
                        REMOTE_USER_ID = 'ltja-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'maoming-web') {
                        REMOTE_HOST = 'maoming-web-ip'
                        REMOTE_USER_ID = 'maoming-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'tiandun-web') {
                        REMOTE_HOST = 'tiandun-web-ip'
                        REMOTE_USER_ID = 'tiandun-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'wanchuang-web') {
                        REMOTE_HOST = 'wanchuang-web-ip'
                        REMOTE_USER_ID = 'wanchuang-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'wanhetong-web') {
                        REMOTE_HOST = 'wanhetong-web-ip'
                        REMOTE_USER_ID = 'wanhetong-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'xinda-web') {
                        REMOTE_HOST = 'xinda-web-ip'
                        REMOTE_USER_ID = 'xinda-host-appuser'
                     } else if ("${REMOTE_NAME}" == 'pingan-web') {
                        REMOTE_HOST = 'pingan-web-ip'
                        REMOTE_USER_ID = 'pingan-host-appuser'
                     }
                    
                                      
                    // Define remote host info according to ssh-steps-plugin
                    def remote = [:]
                    remote.name = "${REMOTE_NAME}"
                    remote.host = "${REMOTE_HOST}"
                    // remote.host = "${params.REMOTE_HOST}"
                    remote.allowAnyHosts = true
                    echo "${REMOTE_HOST}"
                    
                    // Connect to remote host according to ssh (username,password), Username and password are saved in Jenkins certificate.
                    withCredentials([usernamePassword(credentialsId: "${REMOTE_USER_ID}", passwordVariable: 'password', usernameVariable: 'username')]) {
                        remote.user = username
                        remote.password = password
                        // Execute remote host scripts
                        stage("Deploy Application") {
                            writeFile file: "webpack_start.sh", text: "cd /deploy/shell && /bin/bash webpack-rltx.sh"
                            sshScript remote: remote, script: "webpack_start.sh"
                        }
                    }
                }
            }
        }
    }
}
