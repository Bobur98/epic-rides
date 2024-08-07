#!/bin/bash

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

docker compose up -d

# DEVELOPMENT
# git reset --hard
# git checkout develop
# git pull origin develop
