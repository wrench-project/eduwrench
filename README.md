
<img src="web/assets/wrench_logo.png" width="100" />

## eduWRENCH

## Running the Application

### Local installation

Dependencies:
- [WRENCH 1.6-dev](https://github.com/wrench-project/wrench)
- [Node.js](https://nodejs.org/en/)
- [Jekyll](https://jekyllrb.com/docs/installation/)
- [Docker](https://docs.docker.com/install/) (optional)
- [Docker Compose](https://docs.docker.com/compose/install/) (optional)

Run the build script (compiles all simulators, and configures web application):

```
$ ./build.sh
```

Start the backend server:

```
$ cd server
$ node app.js
```

Start the frontend application:

```
$ cd web
$ bundle exec jekyll serve
```

### Running with Docker

```
$ docker pull wrenchproject/eduwrench:unstable
$ mkdir data_server
$ docker-compose up -d
```

## Get in Touch

The main channel to reach the eduWRENCH team is via the support email:
[support@wrench-project.org](mailto:support@wrench-project.org).

**Bug Report / Feature Request:** our preferred channel to report a bug or request a feature is via
WRENCH's [Github Issues Track](https://github.com/wrench-project/eduwrench/issues).

## Funding Support

eduWRENCH has been funded by the National Science Foundation (NSF).

[![NSF Funding 20191][nsf-20191-badge]][nsf-20191-link]
[![NSF Funding 20192][nsf-20192-badge]][nsf-20192-link]

[nsf-20191-badge]:          https://img.shields.io/badge/NSF-1923539-blue
[nsf-20191-link]:           https://nsf.gov/awardsearch/showAward?AWD_ID=1923539
[nsf-20192-badge]:          https://img.shields.io/badge/NSF-1923621-blue
[nsf-20192-link]:           https://nsf.gov/awardsearch/showAward?AWD_ID=1923621
