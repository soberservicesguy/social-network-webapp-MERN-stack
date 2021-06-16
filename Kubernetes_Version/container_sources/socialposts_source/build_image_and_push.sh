






















#!/usr/bin/env bash

docker image build -t socialapp_socialposts_28 .
docker image tag socialapp_socialposts_28 soberservicesguy/portfolio-images:socialapp_socialposts_28
docker image push soberservicesguy/portfolio-images:socialapp_socialposts_28
