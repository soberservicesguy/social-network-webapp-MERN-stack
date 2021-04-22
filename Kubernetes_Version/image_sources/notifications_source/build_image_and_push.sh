#!/usr/bin/env bash

docker image build -t socialapp_notifications_5 .
docker image tag socialapp_notifications_5 soberservicesguy/portfolio-images:socialapp_notifications_5
docker image push soberservicesguy/portfolio-images:socialapp_notifications_5
