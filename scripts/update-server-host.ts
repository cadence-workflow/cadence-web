import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const serverPath = join(process.cwd(), '.next/standalone/server.js');

try {
  const serverContent = readFileSync(serverPath, 'utf8');

  // Check if env vars exist in the files otherwise throw an error
  const hostPattern = /\bprocess\.env\.HOSTNAME\b/;
  if (!hostPattern.test(serverContent)) {
    throw new Error('No process.env.HOSTNAME found in server.js file');
  }

  const portPattern = /\bprocess\.env\.PORT\b/;
  if (!portPattern.test(serverContent)) {
    throw new Error('No process.env.PORT found in server.js file');
  }

  // Replace process.env.HOSTNAME & process.env.PORT with cadence web env vars
  const contentWithHostname = serverContent.replace(
    new RegExp(hostPattern, 'g'),
    'process.env.CADENCE_WEB_HOSTNAME'
  );

  const updatedContent = contentWithHostname.replace(
    new RegExp(portPattern, 'g'),
    'process.env.CADENCE_WEB_PORT'
  );

  // Write the updated content back to the file
  writeFileSync(serverPath, updatedContent);

  // eslint-disable-next-line no-console
  console.log(
    'Successfully updated server.js with CADENCE_WEB_HOSTNAME and CADENCE_WEB_PORT'
  );
  process.exit(0);
} catch (error) {
  if (error instanceof Error) {
    // eslint-disable-next-line no-console
    console.error('Failed to update server.js:', error.message);
  } else {
    // eslint-disable-next-line no-console
    console.error('Failed to update server.js:', error);
  }
  process.exit(1);
}
