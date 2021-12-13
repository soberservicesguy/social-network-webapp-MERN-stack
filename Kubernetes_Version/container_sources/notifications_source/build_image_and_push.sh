




























#!/usr/bin/env bash

docker image build -t socialapp_notifications_34 .
docker image tag socialapp_notifications_34 soberservicesguy/portfolio-images:socialapp_notifications_34
docker image push soberservicesguy/portfolio-images:socialapp_notifications_34
