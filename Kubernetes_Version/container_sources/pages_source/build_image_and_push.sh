


































#!/usr/bin/env bash

docker image build -t socialapp_pages_40 .
docker image tag socialapp_pages_40 soberservicesguy/portfolio-images:socialapp_pages_40
docker image push soberservicesguy/portfolio-images:socialapp_pages_40
