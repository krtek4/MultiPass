#!/bin/bash

DIR=$(pwd)

cd ..
zip MultiPass.zip -r $DIR -x *.git* -x *.editorconfig* -x *package.sh* -x *.idea* -x *README.md* -x *icon-original.png*
mv MultiPass.zip $DIR


