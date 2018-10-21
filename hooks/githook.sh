#!/bin/bash

cd $1
git pull -q
pybabel compile -d translations
touch crypto.wsgi
