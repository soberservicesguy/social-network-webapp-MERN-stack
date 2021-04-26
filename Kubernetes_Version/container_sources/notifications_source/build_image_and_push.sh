

#!/usr/bin/env bash

docker image build -t socialapp_notifications_7 .
docker image tag socialapp_notifications_7 soberservicesguy/portfolio-images:socialapp_notifications_7
docker image push soberservicesguy/portfolio-images:socialapp_notifications_7
