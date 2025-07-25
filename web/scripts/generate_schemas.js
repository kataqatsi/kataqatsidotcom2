import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to extract schema names from the file content
const extractSchemaNames = (data) => {
    const schemaNames = [];
    let insideSchemasBlock = false;

    // Split the file into lines for easier parsing
    const lines = data.split('\n');

    // Iterate over each line to find the start of the schemas block and schema names
    lines.forEach((line) => {
        const trimmedLine = line.trim();

        // Detect the start of the schemas block
        if (trimmedLine === 'schemas: {') {
            insideSchemasBlock = true;
            return;  // Continue to the next line
        }

        // If we're inside the schemas block, find schema names
        if (insideSchemasBlock) {
            // Stop parsing once we reach the end of the schemas block
            if (trimmedLine === '}') {
                insideSchemasBlock = false;
                return;
            }

            // Match schema names in the format: SchemaName: {
            const match = trimmedLine.match(/^(\w+): {/);
            if (match) {
                schemaNames.push(match[1]); // Add the schema name
                console.log("Found schema:", match[1]);  // Log found schema for debugging
            }
        }
    });

    return schemaNames;
};

// Define the path to the `Schemas.ts` file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemasFilePath = path.join(__dirname, '../src/lib/models/Schemas.ts');

// Step 1: Read the `Schemas.ts` file
fs.readFile(schemasFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading Schemas.ts file:', err);
        return;
    }

    // Step 2: Extract schema names from the `components.schemas` interface
    const schemaNames = extractSchemaNames(data);

    if (schemaNames.length === 0) {
        console.log('No schemas found in the Schemas.ts file.');
        return;
    }

    // Step 3: Generate individual export statements for each schema
    const exportStatements = schemaNames.map(schemaName => {
        return `export type ${schemaName} = components['schemas']['${schemaName}'];`;
    }).join('\n');

    console.log("Export statements generated:", exportStatements);  // Log generated export statements

    // Check if the export statements already exist in the file
    if (data.includes(exportStatements)) {
        console.log('Export statements already exist in the Schemas.ts file.');
        return;
    }

    // Step 4: Append the export statements to the `Schemas.ts` file
    const updatedData = `${data}\n\n// Individual exports for schemas\n${exportStatements}\n`;

    fs.writeFile(schemasFilePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to Schemas.ts file:', err);
        } else {
            console.log('Successfully appended individual schema exports to Schemas.ts');
        }
    });
});
