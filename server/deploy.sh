#!/bin/bash

echo what should the version be?
read VERSION
echo $VERSION
docker build -t renoreaper/lireddit:$VERSION .
docker push renoreaper/lireddit:$VERSION
ssh root@142.93.148.135 "docker pull renoreaper/lireddit:$VERSION && docker tag renoreaper/lireddit:$VERSION dokku/api:latest && dokku deploy api latest"