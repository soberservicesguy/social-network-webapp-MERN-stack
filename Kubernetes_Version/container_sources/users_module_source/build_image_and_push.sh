









#!/usr/bin/env bash

docker image build -t socialapp_user_module_15 .
docker image tag socialapp_user_module_15 soberservicesguy/portfolio-images:socialapp_user_module_15
docker image push soberservicesguy/portfolio-images:socialapp_user_module_15
