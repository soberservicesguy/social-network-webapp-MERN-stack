










#!/usr/bin/env bash

docker image build -t socialapp_books_16 .
docker image tag socialapp_books_16 soberservicesguy/portfolio-images:socialapp_books_16
docker image push soberservicesguy/portfolio-images:socialapp_books_16
