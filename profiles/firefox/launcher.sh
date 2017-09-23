#!/bin/bash

captureUrl=$1

# see https://github.com/angular/ci.angularjs.org/blob/5789e4f68e22ee7b8593981e3f806f2f38c9c6ab/bin/ie_.sh#L17
# see https://groups.google.com/forum/#!topic/karma-users/uJa5YdpuRu8


killBrowser() {
  echo "trapped in killing browser by ${captureUrl}" > dist/launcher.log
  ps ax | grep "${captureUrl}" | grep -v grep | awk '{print $1}' | xargs kill -3
}

trap "killBrowser; exit" EXIT

rm -rf ./profiles/firefox/karmauser/*
cp ./profiles/firefox/karmauser-template/* ./profiles/firefox/karmauser/

# --profile path is relative to the execution dir aka workspace root
/usr/bin/firefox --start-debugger-server 9222 --profile ./profiles/firefox/karmauser ${captureUrl}