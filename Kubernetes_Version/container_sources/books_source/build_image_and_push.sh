


































#!/usr/bin/env bash

docker image build -t socialapp_books_40 .
docker image tag socialapp_books_40 soberservicesguy/portfolio-images:socialapp_books_40
docker image push soberservicesguy/portfolio-images:socialapp_books_40
