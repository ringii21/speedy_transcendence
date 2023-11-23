#!/usr/bin/bash

if [ ! -d .env ]; then
  mkdir .env
fi

echo 'DATABASE_URL="postgresql://user:pwd@localhost:5432/dbname?schema=public"' >>.env
echo '42_CLIENT_ID=""' >>.env
echo '42_CILNET_SECRET=""' >>.env
echo 'REDIRECT_URI="http://localhost:3000/auth/42/callback"' >>.env
echo 'AUTHORIZE_URL="https://api.intra.42.fr/oauth/authorize"' >>.env
echo 'TOKEN_URL="https://api.intra.42.fr/oauth/token"' >>.env
echo 'BASE_URL="https://api.intra.42.fr/v2"' >>.env
