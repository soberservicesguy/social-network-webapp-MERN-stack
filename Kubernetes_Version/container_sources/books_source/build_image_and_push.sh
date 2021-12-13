




























#!/usr/bin/env bash

docker image build -t socialapp_books_34 .
docker image tag socialapp_books_34 soberservicesguy/portfolio-images:socialapp_books_34
docker image push soberservicesguy/portfolio-images:socialapp_books_34
