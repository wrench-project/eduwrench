#!/bin/bash

printf "\n${NC}"

printf "${CYAN}"
echo "Calling knex migrate:latest"
printf "${NC}\n"
npx knex migrate:unlock
npx knex migrate:latest
printf "${CYAN}"
echo "Starting node backend server"
printf "${NC}\n"
node app.js 
