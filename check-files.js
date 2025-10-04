const fs = require('fs');
const path = require('path');

const requiredFiles = {
  'server': [
    'app.js',
    'package.json',
    '.env',
    'models/User.js',
    'models/Project.js', 
    'models/Task.js',
    'controllers/auth.js',
    'controllers/projects.js',
    'controllers/tasks.js',
    'routes/auth.js',
    'routes/projects.js',
    'routes/tasks.js',
    'middleware/auth.js',
    'utils/asyncHandler.js',
    'utils/errorResponse.js'
  ],
  'client': [
    'package.json',
    'src/App.js',
    'src/index.js',
    'src/contexts/AuthContext.js',
    'src/services/api.js'
  ]
};

console.log('🔍 Checking project files...\n');

Object.keys(requiredFiles).forEach(folder => {
  console.log(`📁 ${folder.toUpperCase()} FILES:`);
  requiredFiles[folder].forEach(file => {
    const filePath = path.join(__dirname, folder, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  });
  console.log('');
});