







#!/usr/bin/env bash

docker image build -t socialapp_advertisement_40 .
docker image tag socialapp_advertisement_40 soberservicesguy/portfolio-images:socialapp_advertisement_40
docker image push soberservicesguy/portfolio-images:socialapp_advertisement_40