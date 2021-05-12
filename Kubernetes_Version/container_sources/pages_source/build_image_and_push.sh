
















#!/usr/bin/env bash

docker image build -t socialapp_pages_22 .
docker image tag socialapp_pages_22 soberservicesguy/portfolio-images:socialapp_pages_22
docker image push soberservicesguy/portfolio-images:socialapp_pages_22
