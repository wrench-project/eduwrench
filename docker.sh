#!/bin/bash

# Start Node server
cd /home/wrench/eduwrench/server
node app.js &

# Start Gatsby server
cd /home/wrench/eduwrench/web
if [ "${EDUWRENCH_ENABLE_SSL}" = true ]; then
  gatsby develop -H 0.0.0.0 -p 4000 --https --key-file ssl/${EDUWRENCH_SSL_PRIVATE_KEY} --cert-file ssl/${EDUWRENCH_SSL_CERTIFICATE}
else
  gatsby serve -H 0.0.0.0 -p 4000
fi


