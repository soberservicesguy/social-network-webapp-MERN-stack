




#!/usr/bin/env bash

docker image build -t socialapp_advertisement_11 .
docker image tag socialapp_advertisement_11 soberservicesguy/portfolio-images:socialapp_advertisement_11
docker image push soberservicesguy/portfolio-images:socialapp_advertisement_11
