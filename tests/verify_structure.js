const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'index.html',
    'offline.html',
    'css/main.css',
    'js/main.js',
    'js/cart-system.js',
    'js/accessibility.js',
    'js/service-worker.js',
    'package.json'
];

const requiredPatterns = {
    'css/main.css': [
        '--color-dawn-cream', 
        '--texture-mosaic',
        '@layer tokens',
        '.cart-overlay'
    ],
    'index.html': [
        'id="hero"',
        'id="mobile-menu"',
        'serviceWorker.register',
        'class="coffee-steam"'
    ],
    'js/cart-system.js': [
        'class CartSystem',
        'localStorage.getItem',
        'updateTotals()'
    ]
};

let passed = true;

console.log('🔍 Starting Project Verification...\n');

// Check Files
console.log('checking Files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ Found ${file}`);
    } else {
        console.log(`  ❌ MISSING ${file}`);
        passed = false;
    }
});

// Check Content
console.log('\nChecking Content Patterns:');
Object.keys(requiredPatterns).forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        requiredPatterns[file].forEach(pattern => {
            if (content.includes(pattern)) {
                console.log(`  ✅ ${file} contains "${pattern}"`);
            } else {
                console.log(`  ❌ ${file} missing "${pattern}"`);
                passed = false;
            }
        });
    }
});

if (passed) {
    console.log('\n✨ VERIFICATION PASSED: Project structure is correct.');
    process.exit(0);
} else {
    console.error('\n💀 VERIFICATION FAILED: Missing files or patterns.');
    process.exit(1);
}
