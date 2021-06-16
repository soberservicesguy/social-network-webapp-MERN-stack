





















#!/usr/bin/env bash

docker image build -t socialapp_notifications_27 .
docker image tag socialapp_notifications_27 soberservicesguy/portfolio-images:socialapp_notifications_27
docker image push soberservicesguy/portfolio-images:socialapp_notifications_27
