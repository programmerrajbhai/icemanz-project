const fs = require('fs');
fs.rmSync('.next/cache', { recursive: true, force: true });
console.log('Cache cleared');
