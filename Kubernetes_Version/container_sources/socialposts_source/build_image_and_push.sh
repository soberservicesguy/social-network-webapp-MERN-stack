




#!/usr/bin/env bash

docker image build -t socialapp_socialposts_39 .
docker image tag socialapp_socialposts_39 soberservicesguy/portfolio-images:socialapp_socialposts_39
docker image push soberservicesguy/portfolio-images:socialapp_socialposts_39
