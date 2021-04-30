








#!/usr/bin/env bash

docker image build -t socialapp_user_module_14 .
docker image tag socialapp_user_module_14 soberservicesguy/portfolio-images:socialapp_user_module_14
docker image push soberservicesguy/portfolio-images:socialapp_user_module_14
