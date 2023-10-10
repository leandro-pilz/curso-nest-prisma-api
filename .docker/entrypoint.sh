#!/bin/bash

npm install
npm install prisma -D
npx prisma init
npx prisma studio
npm install class-validator class-transformer
npm run build
npm run "start:dev"
