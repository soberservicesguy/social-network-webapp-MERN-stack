









#!/usr/bin/env bash

docker image build -t socialapp_advertisement_42 .
docker image tag socialapp_advertisement_42 soberservicesguy/portfolio-images:socialapp_advertisement_42
docker image push soberservicesguy/portfolio-images:socialapp_advertisement_42