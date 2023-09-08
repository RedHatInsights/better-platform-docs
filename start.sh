#!/bin/bash

# turn on bash's job control
set -m

# Start the first process
npm run serve &

caddy run --config /opt/app-root/src/Caddyfile &

# now we bring the primary process back into the foreground
# and leave it there
fg %2
