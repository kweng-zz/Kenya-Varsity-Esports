import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToConvert = [
  'September-Season.png',
  'January-Season.png', 
  'Tournament-page.png',
  'eFOOTBALL-CTA-Rankings.png',
  'Join-Your-Uni.png'
];

const imagesDir = path.join(__dirname, '../public/images');

async function convertImageToWebP(imageName) {
  const inputPath = path.join(imagesDir, imageName);
  const outputName = imageName.replace('.png', '.webp');
  const outputPath = path.join(imagesDir, outputName);

  try {
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    console.log(`Converting ${imageName} (${(originalSize / 1024 / 1024).toFixed(2)}MB)...`);

    // Convert to WebP with 80% quality
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Get new file size
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${imageName} -> ${outputName}`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   WebP: ${(newSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Size reduction: ${reduction}%`);
    console.log('');

    return {
      original: imageName,
      converted: outputName,
      originalSize: originalSize,
      newSize: newSize,
      reduction: reduction
    };

  } catch (error) {
    console.error(`❌ Error converting ${imageName}:`, error.message);
    return null;
  }
}

async function convertAllImages() {
  console.log('Starting PNG to WebP conversion...\n');
  
  const results = [];
  
  for (const imageName of imagesToConvert) {
    const result = await convertImageToWebP(imageName);
    if (result) {
      results.push(result);
    }
  }

  console.log('Conversion Summary:');
  console.log('==================');
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  
  results.forEach(result => {
    totalOriginalSize += result.originalSize;
    totalNewSize += result.newSize;
  });

  const totalReduction = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total WebP size: ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total size reduction: ${totalReduction}%`);
  
  return results;
}

// Run the conversion
if (import.meta.url === `file://${process.argv[1]}`) {
  convertAllImages().catch(console.error);
}

export { convertAllImages, convertImageToWebP };