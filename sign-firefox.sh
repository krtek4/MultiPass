#!/bin/bash

npm run dist

echo "multipass-temp@gilles.crettenand.info" > build/firefox/.web-extension-id
sed -i 's/multipass@gilles.crettenand.info/multipass-temp@gilles.crettenand.info/g' build/firefox/manifest.json
sed -i 's/__MSG_extName__/Multipass/g' build/firefox/manifest.json

./node_modules/.bin/web-ext sign -s build/firefox/ -a dist --api-key $AMO_JWT_ISSUER --api-secret $AMO_JWT_SECRET
