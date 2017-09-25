#!/bin/bash

captureUrl=$1

# see https://github.com/angular/ci.angularjs.org/blob/5789e4f68e22ee7b8593981e3f806f2f38c9c6ab/bin/ie_.sh#L17
# see https://groups.google.com/forum/#!topic/karma-users/uJa5YdpuRu8
function locateMe(){
    typeset _me_scrpt_bsrc;
    
    _me_scrpt_bsrc="${BASH_SOURCE}";
    export LAUNCHER_FIREFOX_SCRPT_BASE="$( basename "${_me_scrpt_bsrc}" )";
    export LAUNCHER_FIREFOX_SCRPT_PARENT="$( cd "$( dirname "${_me_scrpt_bsrc}" )" && pwd )"/;
    export LAUNCHER_FIREFOX_SCRPT=$LAUNCHER_FIREFOX_SCRPT_PARENT$LAUNCHER_FIREFOX_SCRPT_BASE
}

locateMe

function killBrowser() {
  echo "trapped in killing browser by ${captureUrl}" >> dist/launcher.log
  ps ax | grep "${captureUrl}" | grep -v grep | awk '{print $1}' | xargs kill -3
}

trap "killBrowser; exit" EXIT

mkdir -p ${LAUNCHER_FIREFOX_SCRPT_PARENT}karmauser
rm -rf ${LAUNCHER_FIREFOX_SCRPT_PARENT}karmauser/*
cp ${LAUNCHER_FIREFOX_SCRPT_PARENT}karmauser-template/* ${LAUNCHER_FIREFOX_SCRPT_PARENT}karmauser/

# --profile path is relative to the execution dir aka workspace root
echo "/usr/bin/firefox --new-instance --start-debugger-server 9222 --profile ${LAUNCHER_FIREFOX_SCRPT_PARENT}karmauser ${captureUrl}" > dist/launcher.log
/usr/bin/firefox --new-instance --start-debugger-server 9222 --profile ${LAUNCHER_FIREFOX_SCRPT_PARENT}/karmauser ${captureUrl}
