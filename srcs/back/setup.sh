#!/usr/bin/bash

if [ ! -d .env ]; then
  touch .env
fi

jwtsecret=$(openssl rand -hex 20)
echo 'DATABASE_URL="postgresql://user:pwd@localhost:5432/dbname?schema=public"' >>.env
echo 'CLIENT_ID=""' >>.env
echo 'CLIENT_SECRET=""' >>.env
echo 'FRONT_URL="http://localhost:3001"' >>.env
echo 'CALLBACK_URL="http://localhost:3000/auth/42/callback"' >>.env
echo 'AUTHORIZE_URL="https://api.intra.42.fr/oauth/authorize"' >>.env
echo 'TOKEN_URL="https://api.intra.42.fr/oauth/token"' >>.env
echo 'BASE_URL="https://api.intra.42.fr/v2"' >>.env
echo 'JWT_SECRET="$jwtsecret"' >>.env
