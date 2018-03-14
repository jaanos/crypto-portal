# Crypto portal

A portal for cryptography (for now, in Slovene) for the purposes of a summer school in cryptography and beyond.

Written in python-flask, allowing both local test runs and Apache integration through WSGI.
To run locally, copy `auth.py.template` to `auth.py` (actual login data is not needed for the majority of the site) and run `crypto.py`.

The *work* branch should contain the current working version, without specifics needed for deploying (see below). Any subprojects should start by branching off *work*, and any finished subprojects shall be merged into *work* before being deployed.

The *devel* branch is automatically pushed to the live version at https://lkrv.fri.uni-lj.si/crypto-devel (access restricted to collaborators). Merging work in progress is permitted, but please do not merge *devel* into *master*.

The *master* branch is automatically pushed to the live version at https://lkrv.fri.uni-lj.si/crypto-portal .
