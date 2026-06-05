#!/bin/sh
set -e

echo "Running database migrations..."
NODE_ENV=production node ./node_modules/typeorm/cli.js -d dist/database/data-source.js migration:run

echo "Starting API..."
exec node dist/main.js
