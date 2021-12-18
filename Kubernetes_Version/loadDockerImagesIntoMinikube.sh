#!/usr/bin/env bash

# minikube start
echo "enabling kubernetes to access docker daemon"
echo 'running eval $(minikube docker-env)'
eval $(minikube docker-env)

echo " "
echo "running minikube image load socialapp_socialposts"
echo " "
minikube image load socialapp_socialposts

echo " "
echo "running minikube image load socialapp_advertisement"
echo " "
minikube image load socialapp_advertisement

echo " "
echo "running minikube image load socialapp_users_module"
echo " "
minikube image load socialapp_users_module

echo " "
echo "running minikube image load socialapp_pages"
echo " "
minikube image load socialapp_pages

echo " "
echo "running minikube image load socialapp_sports"
echo " "
minikube image load socialapp_sports

echo " "
echo "running minikube image load socialapp_notifications"
echo " "
minikube image load socialapp_notifications

echo " "
echo "running minikube image load socialapp_books"
echo " "
minikube image load socialapp_books

echo " "
echo "running minikube image load socialapp_friends"
echo " "
minikube image load socialapp_friends

echo " "
echo "running minikube image load socialapp_frontend"
echo " "
minikube image load socialapp_frontend