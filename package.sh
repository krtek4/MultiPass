#!/bin/bash

DIR=$(pwd)

cd ..
zip MultiPass.zip -r $DIR -x *.git* -x *.editorconfig* -x *package.sh* -x *.idea* -x *README.md* -x *LICENSE* -x *icon-original.png* -x *CHANGELOG.md* -x *MultiPass.zip*
mv MultiPass.zip $DIR


