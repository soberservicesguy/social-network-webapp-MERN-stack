




































#!/usr/bin/env bash

docker image build -t socialapp_books_42 .
docker image tag socialapp_books_42 soberservicesguy/portfolio-images:socialapp_books_42
docker image push soberservicesguy/portfolio-images:socialapp_books_42
