#!/usr/bin/env bash
docker image build -t socialapp_socialposts ../Containers_Version/image_sources/socialposts
docker image build -t socialapp_advertisement ../Containers_Version/image_sources/advertisements
docker image build -t socialapp_users_module ../Containers_Version/image_sources/user_module
docker image build -t socialapp_pages ../Containers_Version/image_sources/pages
docker image build -t socialapp_sports ../Containers_Version/image_sources/sports
docker image build -t socialapp_notifications ../Containers_Version/image_sources/notifications
docker image build -t socialapp_books ../Containers_Version/image_sources/books
docker image build -t socialapp_friends ../Containers_Version/image_sources/friends
docker image build -t socialapp_frontend ../Containers_Version/image_sources/frontend_service