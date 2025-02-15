#!/bin/bash

set -e
set -x

if [ "$DB_HOST" != "localhost" ]; then
  echo "DB_HOST is not set to localhost. Exiting..."
  exit 1
fi

npm run migration:run

echo "Test data is cleaning."
npx ts-node test/setup/delete-data.ts

echo "Test data is uploading..."
npx ts-node test/setup/load-data.ts

echo "Tests are running..."
npm run test
