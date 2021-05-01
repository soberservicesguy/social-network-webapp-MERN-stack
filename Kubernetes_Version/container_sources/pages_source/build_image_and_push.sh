











#!/usr/bin/env bash

docker image build -t socialapp_pages_17 .
docker image tag socialapp_pages_17 soberservicesguy/portfolio-images:socialapp_pages_17
docker image push soberservicesguy/portfolio-images:socialapp_pages_17
