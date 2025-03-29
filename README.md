[![Build Status][action-badge]][action-link]
[![License: LGPL v3][license-badge]](LICENSE)
[![CodeFactor][codefactor-badge]][codefactor-link]

<img src="web/src/images/wrench_logo.png" width="100" />

## eduWRENCH

## Running the Application

### Running with Docker

Dependencies:
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Edit/use one of the `.env-*` files to configure the deployment, and then:

```bash
$ docker-compose --env-file <.env file> build  --no-cache
$ docker-compose up [-d]
```

The above will not run any Nginx front-end. If you want to do so, you must add the `--profile with-my-own-nginx` argument to the `docker-compose` commands above. 

## Get in Touch

The main channel to reach the eduWRENCH team is via the support email:
[support@wrench-project.org](mailto:support@wrench-project.org).

**Bug Report / Feature Request:** our preferred channel to report a bug or request a feature is via
WRENCH's [Github Issues Track](https://github.com/wrench-project/eduwrench/issues).

## Funding Support

eduWRENCH has been funded by the National Science Foundation (NSF).

[![NSF Funding 20191][nsf-20191-badge]][nsf-20191-link]
[![NSF Funding 20192][nsf-20192-badge]][nsf-20192-link]

[action-badge]:             https://github.com/wrench-project/eduwrench/actions/workflows/build-and-deploy.yml/badge.svg
[action-link]:              https://github.com/wrench-project/eduwrench/actions/workflows/build-and-deploy.yml
[license-badge]:            https://img.shields.io/badge/License-LGPL%20v3-blue.svg
[codefactor-badge]:         https://www.codefactor.io/repository/github/wrench-project/eduwrench/badge
[codefactor-link]:          https://www.codefactor.io/repository/github/wrench-project/eduwrench
[nsf-20191-badge]:          https://img.shields.io/badge/NSF-1923539-blue
[nsf-20191-link]:           https://nsf.gov/awardsearch/showAward?AWD_ID=1923539
[nsf-20192-badge]:          https://img.shields.io/badge/NSF-1923621-blue
[nsf-20192-link]:           https://nsf.gov/awardsearch/showAward?AWD_ID=1923621
