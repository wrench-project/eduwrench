[![Build Status][travis-badge]][travis-link]
[![License: LGPL v3][license-badge]](LICENSE)
[![CodeFactor][codefactor-badge]][codefactor-link]

<img src="web/src/images/wrench_logo.png" width="100" />

## eduWRENCH

## Running the Application

### Local installation

Dependencies:
- [WRENCH 1.7-dev](https://github.com/wrench-project/wrench)
- [Node.js](https://nodejs.org/en/)
- [Jekyll](https://jekyllrb.com/docs/installation/)

Run the build script (compiles all simulators, and configures web application):

```bash
$ ./build.sh
```

Start the backend server:

```bash
$ cd server
$ nodemon app.js
```

Start the frontend application:

```bash
$ cd web
$ gatsby develop
```

Open a Web browser and navigate to http://localhost:4000

### Running with Docker

Dependencies:
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

```bash
$ docker pull wrenchproject/wrench:1.6
$ mkdir data_server
$ docker-compose build --no-cache
$ docker-compose up -d
```

### Enabling SSL deployment

By default, eduWRENCH is configured to run in _SSL disabled_ mode. SSL
support can be enabled by editing the `.env` file. The following variables
need to be defined to enable SSL support:

```bash
# Port number for Jekyll application (frontend)
EDUWRENCH_JEKYLL_PORT=443
# Enable SSL connection (true|false)
EDUWRENCH_ENABLE_SSL=true
# Folder where certificates are stored in the local system
EDUWRENCH_SSL_CERTS_DIR=./ssl
# Name of the certificate file
EDUWRENCH_SSL_CERTIFICATE=cert.pem
# Name of the private key file
EDUWRENCH_SSL_PRIVATE_KEY=key.pem
```

If running the **Local installation**, the environment should be set by
running the following command: `$ source .env`. If running with **Docker**
no additional steps are required, since the `.env` file is automatically
read by the `docker-compose` command.

## Get in Touch

The main channel to reach the eduWRENCH team is via the support email:
[support@wrench-project.org](mailto:support@wrench-project.org).

**Bug Report / Feature Request:** our preferred channel to report a bug or request a feature is via
WRENCH's [Github Issues Track](https://github.com/wrench-project/eduwrench/issues).

## Funding Support

eduWRENCH has been funded by the National Science Foundation (NSF).

[![NSF Funding 20191][nsf-20191-badge]][nsf-20191-link]
[![NSF Funding 20192][nsf-20192-badge]][nsf-20192-link]

[travis-badge]:             https://travis-ci.org/wrench-project/eduwrench.svg?branch=master
[travis-link]:              https://travis-ci.org/wrench-project/eduwrench
[license-badge]:            https://img.shields.io/badge/License-LGPL%20v3-blue.svg
[codefactor-badge]:         https://www.codefactor.io/repository/github/wrench-project/eduwrench/badge
[codefactor-link]:          https://www.codefactor.io/repository/github/wrench-project/eduwrench
[nsf-20191-badge]:          https://img.shields.io/badge/NSF-1923539-blue
[nsf-20191-link]:           https://nsf.gov/awardsearch/showAward?AWD_ID=1923539
[nsf-20192-badge]:          https://img.shields.io/badge/NSF-1923621-blue
[nsf-20192-link]:           https://nsf.gov/awardsearch/showAward?AWD_ID=1923621
