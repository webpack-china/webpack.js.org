#!/bin/bash
# see https://gist.github.com/domenic/ec8b0fc8ab45f39403dd

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}

# Run tests
# yarn test

# Run our build
yarn build

# Set some git options
git config --global user.name "docschina"
git config --global user.email "admin@docschina.org"
git remote set-url origin "${SSH_REPO}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
#ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
#ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
#ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
#ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
chmod -R 777 node_modules/gh-pages/

# Now that we're all set up, we can deploy
yarn deploy
