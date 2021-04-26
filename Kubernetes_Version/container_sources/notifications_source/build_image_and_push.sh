
#!/usr/bin/env bash

docker image build -t socialapp_notifications_6 .
docker image tag socialapp_notifications_6 soberservicesguy/portfolio-images:socialapp_notifications_6
docker image push soberservicesguy/portfolio-images:socialapp_notifications_6
