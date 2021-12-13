




























#!/usr/bin/env bash

docker image build -t socialapp_sports_34 .
docker image tag socialapp_sports_34 soberservicesguy/portfolio-images:socialapp_sports_34
docker image push soberservicesguy/portfolio-images:socialapp_sports_34
