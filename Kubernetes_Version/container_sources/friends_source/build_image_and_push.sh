




































#!/usr/bin/env bash

docker image build -t socialapp_friends_42 .
docker image tag socialapp_friends_42 soberservicesguy/portfolio-images:socialapp_friends_42
docker image push soberservicesguy/portfolio-images:socialapp_friends_42
