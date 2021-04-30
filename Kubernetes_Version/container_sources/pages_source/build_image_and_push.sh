









#!/usr/bin/env bash

docker image build -t socialapp_pages_15 .
docker image tag socialapp_pages_15 soberservicesguy/portfolio-images:socialapp_pages_15
docker image push soberservicesguy/portfolio-images:socialapp_pages_15
