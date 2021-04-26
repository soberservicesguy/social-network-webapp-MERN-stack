




#!/usr/bin/env bash

docker image build -t socialapp_books_10 .
docker image tag socialapp_books_10 soberservicesguy/portfolio-images:socialapp_books_10
docker image push soberservicesguy/portfolio-images:socialapp_books_10
