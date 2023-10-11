#!/bin/bash

npm install
npm install prisma -D
npx prisma init
npm install class-validator class-transformer
npm run build
npm run "start:dev"
