#!/usr/bin/env bash
#rm -rf ../public/
mkdir ../public/
cp .nojekyll ../public/
cp -r ../dist assets ../public/
../bin/render.js -i index.html -o ../public/index.html
