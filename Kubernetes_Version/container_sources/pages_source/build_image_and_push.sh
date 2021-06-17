























#!/usr/bin/env bash

docker image build -t socialapp_pages_29 .
docker image tag socialapp_pages_29 soberservicesguy/portfolio-images:socialapp_pages_29
docker image push soberservicesguy/portfolio-images:socialapp_pages_29
