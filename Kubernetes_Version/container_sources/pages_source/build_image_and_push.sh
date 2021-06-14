


















#!/usr/bin/env bash

docker image build -t socialapp_pages_24 .
docker image tag socialapp_pages_24 soberservicesguy/portfolio-images:socialapp_pages_24
docker image push soberservicesguy/portfolio-images:socialapp_pages_24
