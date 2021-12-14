







































#!/usr/bin/env bash

docker image build -t socialapp_pages_45 .
docker image tag socialapp_pages_45 soberservicesguy/portfolio-images:socialapp_pages_45
docker image push soberservicesguy/portfolio-images:socialapp_pages_45
