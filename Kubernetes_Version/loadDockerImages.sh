#!/usr/bin/env bash

# minikube start
cat 'enabling kubernetes to access docker daemon'
cat 'running "eval $(minikube docker-env)"'
eval $(minikube docker-env)

cat ' '
cat 'running "minikube image load socialapp_socialposts"'
cat ' '
minikube image load socialapp_socialposts

cat ' '
cat 'running "minikube image load socialapp_advertisement"'
cat ' '
minikube image load socialapp_advertisement

cat ' '
cat 'running "minikube image load socialapp_users_module"'
cat ' '
minikube image load socialapp_users_module

cat ' '
cat 'running "minikube image load socialapp_pages"'
cat ' '
minikube image load socialapp_pages

cat ' '
cat 'running "minikube image load socialapp_sports"'
cat ' '
minikube image load socialapp_sports

cat ' '
cat 'running "minikube image load socialapp_notifications"'
cat ' '
minikube image load socialapp_notifications

cat ' '
cat 'running "minikube image load socialapp_books"'
cat ' '
minikube image load socialapp_books

cat ' '
cat 'running "minikube image load socialapp_friends"'
cat ' '
minikube image load socialapp_friends

cat ' '
cat 'running "minikube image load socialapp_friends"'
cat ' '
minikube image load socialapp_frontend