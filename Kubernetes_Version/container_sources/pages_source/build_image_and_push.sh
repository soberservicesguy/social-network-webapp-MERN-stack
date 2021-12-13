
































#!/usr/bin/env bash

docker image build -t socialapp_pages_38 .
docker image tag socialapp_pages_38 soberservicesguy/portfolio-images:socialapp_pages_38
docker image push soberservicesguy/portfolio-images:socialapp_pages_38
