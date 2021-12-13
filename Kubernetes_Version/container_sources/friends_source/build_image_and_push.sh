

































#!/usr/bin/env bash

docker image build -t socialapp_friends_39 .
docker image tag socialapp_friends_39 soberservicesguy/portfolio-images:socialapp_friends_39
docker image push soberservicesguy/portfolio-images:socialapp_friends_39
