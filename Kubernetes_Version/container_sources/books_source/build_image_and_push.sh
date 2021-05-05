














#!/usr/bin/env bash

docker image build -t socialapp_books_20 .
docker image tag socialapp_books_20 soberservicesguy/portfolio-images:socialapp_books_20
docker image push soberservicesguy/portfolio-images:socialapp_books_20
