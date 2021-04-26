
#!/usr/bin/env bash

docker image build -t socialapp_socialposts_6 .
docker image tag socialapp_socialposts_6 soberservicesguy/portfolio-images:socialapp_socialposts_6
docker image push soberservicesguy/portfolio-images:socialapp_socialposts_6
