#!/bin/bash

# Colors
ORANGE='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

printf "${ORANGE}"
echo "======================================"
echo "  eduWRENCH - Build"
echo "======================================"
printf "\n${NC}"

# Start Node server
printf "${CYAN}"
echo "[1/2] START NODE SERVER"
printf "${NC}\n"

cd /home/wrench/eduwrench/server
npx knex migrate:latest
node app.js &

# Start Gatsby server
printf "${CYAN}\n"
echo "[2/2] START GATSBY SERVER"
printf "${NC}\n"

cd /home/wrench/eduwrench/web
if [ "${EDUWRENCH_ENABLE_SSL}" = true ]; then
  gatsby develop -H 0.0.0.0 -p 4000 --https --key-file ssl/${EDUWRENCH_SSL_PRIVATE_KEY} --cert-file ssl/${EDUWRENCH_SSL_CERTIFICATE}
else
  gatsby serve -H 0.0.0.0 -p 4000
fi
