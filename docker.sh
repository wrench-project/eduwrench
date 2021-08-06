#!/bin/bash

if [ "${EDUWRENCH_ENABLE_SSL}" = true ]; then
  gatsby develop -H 0.0.0.0 -p 4000 --https --key-file ssl/${EDUWRENCH_SSL_PRIVATE_KEY} --cert-file ssl/${EDUWRENCH_SSL_CERTIFICATE} && node /home/wrench/eduwrench/server/app.js
else
  gatsby serve -H 0.0.0.0 -p 4000 && node /home/wrench/eduwrench/server/app.js
fi
