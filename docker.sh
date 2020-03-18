#!/bin/bash

if [ "${EDUWRENCH_ENABLE_SSL}" = true ]; then
  bundle exec jekyll serve --trace -H 0.0.0.0 -P 4000 -B --ssl-key ssl/${EDUWRENCH_SSL_PRIVATE_KEY} --ssl-cert ssl/${EDUWRENCH_SSL_CERTIFICATE} && node /home/wrench/eduwrench/server/app.js
else
  bundle exec jekyll serve -H 0.0.0.0 -P 4000 -B && node /home/wrench/eduwrench/server/app.js
fi
