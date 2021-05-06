















#!/usr/bin/env bash

docker image build -t socialapp_pages_21 .
docker image tag socialapp_pages_21 soberservicesguy/portfolio-images:socialapp_pages_21
docker image push soberservicesguy/portfolio-images:socialapp_pages_21
