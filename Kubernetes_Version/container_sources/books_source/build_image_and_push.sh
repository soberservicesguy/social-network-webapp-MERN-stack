
#!/usr/bin/env bash

docker image build -t socialapp_books_6 .
docker image tag socialapp_books_6 soberservicesguy/portfolio-images:socialapp_books_6
docker image push soberservicesguy/portfolio-images:socialapp_books_6
