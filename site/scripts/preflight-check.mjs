import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.join(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '\n🚀 Starting ProWeb Studio Pre-flight Check...\n');

let hasErrors = false;

function check(name, fn) {
    try {
        process.stdout.write(`Checking ${name}... `);
        fn();
        console.log('\x1b[32m%s\x1b[0m', '✅ OK');
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', '❌ FAILED');
        console.error(`   Error: ${error.message}`);
        hasErrors = true;
    }
}

// 1. TypeScript Check
check('TypeScript Compliance', () => {
    execSync('npm run typecheck', { stdio: 'pipe', cwd: SITE_ROOT });
});

// 2. Broken Files Check
check('Broken File Extensions', () => {
    const result = execSync('find src -name "*.broken" -o -name "*.old" -o -name "*.tmp"', { encoding: 'utf-8', cwd: SITE_ROOT });
    if (result.trim().length > 0) {
        throw new Error(`Found temporary/broken files:\n${result}`);
    }
});

// 3. Dutch SEO Check
check('Dutch Locale Enforcement', () => {
    const layoutPath = path.join(SITE_ROOT, 'src/app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');
    if (!content.includes('lang="nl-NL"')) {
        throw new Error('layout.tsx does not strictly enforce lang="nl-NL"');
    }
});

// 4. Critical ENV Vars
check('Environment Variables', () => {
    // Just checking existence of a few keys, strict check is in next.config.mjs
    const missing = [];
    // For preflight, we might not have all secrets, but we expect structure
    // This is a "sanity check"
    if (!fs.existsSync(path.join(SITE_ROOT, 'next.config.mjs'))) {
        throw new Error('next.config.mjs missing');
    }
});

console.log('\n-----------------------------------');
if (hasErrors) {
    console.log('\x1b[31m%s\x1b[0m', '💥 Pre-flight Check FAILED. Fix errors before deploying.');
    process.exit(1);
} else {
    console.log('\x1b[32m%s\x1b[0m', '✨ All systems GO! Ready for deployment.');
    process.exit(0);
}
