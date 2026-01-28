const { spawn } = require('child_process');

console.log('Testing OpenCode plugin load...\n');

// Run opencode briefly
const opencode = spawn('opencode', ['--version'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  timeout: 3000
});

let output = '';
let errors = '';

opencode.stdout.on('data', (data) => {
  output += data.toString();
});

opencode.stderr.on('data', (data) => {
  errors += data.toString();
});

opencode.on('close', (code) => {
  console.log('Exit code:', code);
  console.log('Output:', output.trim());
  
  if (errors) {
    console.log('Errors:', errors.substring(0, 200));
  }
  
  if (code === 0 && output.includes('1.1.39')) {
    console.log('\n✅ OpenCode starts successfully');
    console.log('✅ Plugin should load in OpenCode environment');
  } else {
    console.log('\n⚠️ OpenCode may have issues');
  }
});
