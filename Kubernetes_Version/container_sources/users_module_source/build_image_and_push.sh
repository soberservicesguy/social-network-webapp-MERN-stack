


































#!/usr/bin/env bash

docker image build -t socialapp_user_module_40 .
docker image tag socialapp_user_module_40 soberservicesguy/portfolio-images:socialapp_user_module_40
docker image push soberservicesguy/portfolio-images:socialapp_user_module_40
