#!/bin/bash

# Step 0: Set the API URL
API_URL=http://localhost:8000

# Step 1: Remove the old generated schemas file
rm ./src/lib/models/Schemas.ts

# Step 2: Generate new TypeScript schema definitions using openapi-typescript
npx openapi-typescript $API_URL/openapi.json --output ./src/lib/models/Schemas.ts

# Step 3: Post-process the generated file to add individual type exports
node ./scripts/generate_schemas.js


