







#!/usr/bin/env bash

docker image build -t socialapp_pages_13 .
docker image tag socialapp_pages_13 soberservicesguy/portfolio-images:socialapp_pages_13
docker image push soberservicesguy/portfolio-images:socialapp_pages_13
