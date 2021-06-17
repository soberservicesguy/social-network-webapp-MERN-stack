























#!/usr/bin/env bash

docker image build -t socialapp_sports_29 .
docker image tag socialapp_sports_29 soberservicesguy/portfolio-images:socialapp_sports_29
docker image push soberservicesguy/portfolio-images:socialapp_sports_29
