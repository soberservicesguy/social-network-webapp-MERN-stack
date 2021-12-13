
































#!/usr/bin/env bash

docker image build -t socialapp_books_38 .
docker image tag socialapp_books_38 soberservicesguy/portfolio-images:socialapp_books_38
docker image push soberservicesguy/portfolio-images:socialapp_books_38
