






























#!/usr/bin/env bash

docker image build -t socialapp_books_36 .
docker image tag socialapp_books_36 soberservicesguy/portfolio-images:socialapp_books_36
docker image push soberservicesguy/portfolio-images:socialapp_books_36
