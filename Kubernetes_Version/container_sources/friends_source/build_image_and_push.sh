







#!/usr/bin/env bash

docker image build -t socialapp_friends_13 .
docker image tag socialapp_friends_13 soberservicesguy/portfolio-images:socialapp_friends_13
docker image push soberservicesguy/portfolio-images:socialapp_friends_13
