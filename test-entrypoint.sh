#!/bin/bash

# Load environment variables from .env.production (excluding comments)
export $(grep -v '^#' .env.production | xargs)

# Test the entrypoint
bash docker-entrypoint.sh