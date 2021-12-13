





#!/usr/bin/env bash

docker image build -t socialapp_socialposts_40 .
docker image tag socialapp_socialposts_40 soberservicesguy/portfolio-images:socialapp_socialposts_40
docker image push soberservicesguy/portfolio-images:socialapp_socialposts_40
