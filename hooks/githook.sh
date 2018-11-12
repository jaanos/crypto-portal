#!/bin/bash

cd $1
git pull -q
/usr/local/bin/pybabel/pybabel compile -d translations
touch crypto.wsgi
