

























#!/usr/bin/env bash

docker image build -t socialapp_socialposts_31 .
docker image tag socialapp_socialposts_31 soberservicesguy/portfolio-images:socialapp_socialposts_31
docker image push soberservicesguy/portfolio-images:socialapp_socialposts_31
