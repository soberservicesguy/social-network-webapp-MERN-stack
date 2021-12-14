




































#!/usr/bin/env bash

docker image build -t socialapp_pages_42 .
docker image tag socialapp_pages_42 soberservicesguy/portfolio-images:socialapp_pages_42
docker image push soberservicesguy/portfolio-images:socialapp_pages_42
