#!/usr/bin/env bash
kubectl delete -f mongodb-depl-serv.yaml
kubectl delete -f frontend-depl-serv.yaml
kubectl delete -f advertisement-depl-serv.yaml
kubectl delete -f books-depl-serv.yaml
kubectl delete -f friends-depl-serv.yaml
kubectl delete -f notifications-depl-serv.yaml
kubectl delete -f pages-depl-serv.yaml
kubectl delete -f socialposts-depl-serv.yaml
kubectl delete -f sports-depl-serv.yaml
kubectl delete -f users-module-depl-serv.yaml
kubectl delete -f ingress.yaml