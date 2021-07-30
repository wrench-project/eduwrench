#!/bin/bash

if [ "${EDUWRENCH_ENABLE_SSL}" = true ]; then
  gatsby serve --trace -H 0.0.0.0 -p 4000 --ssl-key ssl/${EDUWRENCH_SSL_PRIVATE_KEY} --ssl-cert ssl/${EDUWRENCH_SSL_CERTIFICATE} && node /home/wrench/eduwrench/server/app.js
else
  gatsby serve -H 0.0.0.0 -p 4000 && node /home/wrench/eduwrench/server/app.js
fi
