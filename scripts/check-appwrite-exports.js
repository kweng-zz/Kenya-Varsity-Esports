try {
  const inputFile = await import('node-appwrite/dist/inputFile.js');
  console.log('inputFile.js keys:', Object.keys(inputFile));
  console.log('inputFile.js default keys:', inputFile.default ? Object.keys(inputFile.default) : 'no default');
} catch (e) {
  console.log('Failed to import node-appwrite/dist/inputFile.js:', e.message);
}

try {
  const models = await import('node-appwrite/dist/models.js');
  console.log('models.js keys:', Object.keys(models));
} catch (e) {
  console.log('Failed to import node-appwrite/dist/models.js:', e.message);
}
