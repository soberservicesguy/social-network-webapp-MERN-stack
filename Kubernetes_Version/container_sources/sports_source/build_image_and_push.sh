




















#!/usr/bin/env bash

docker image build -t socialapp_sports_26 .
docker image tag socialapp_sports_26 soberservicesguy/portfolio-images:socialapp_sports_26
docker image push soberservicesguy/portfolio-images:socialapp_sports_26
