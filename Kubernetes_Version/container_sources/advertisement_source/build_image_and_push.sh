





#!/usr/bin/env bash

docker image build -t socialapp_advertisement_12 .
docker image tag socialapp_advertisement_12 soberservicesguy/portfolio-images:socialapp_advertisement_12
docker image push soberservicesguy/portfolio-images:socialapp_advertisement_12
