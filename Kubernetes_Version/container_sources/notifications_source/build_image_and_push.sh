











#!/usr/bin/env bash

docker image build -t socialapp_notifications_17 .
docker image tag socialapp_notifications_17 soberservicesguy/portfolio-images:socialapp_notifications_17
docker image push soberservicesguy/portfolio-images:socialapp_notifications_17
