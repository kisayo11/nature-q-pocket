const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const sharp = require('../app/node_modules/sharp');
const { PDFDocument } = require('../app/node_modules/pdf-lib');
const ascii85 = require('../app/node_modules/ascii85');

async function optimizeOnePdf(inputPath, publicOutPath, distOutPath) {
  const pdfBuf = fs.readFileSync(inputPath);
  const pdfStr = pdfBuf.toString('latin1');
  
  if (!pdfStr.includes('ReportLab')) {
    // Already optimized
    const stat = fs.statSync(inputPath);
    return { origSize: stat.size, newSize: stat.size, pages: 0, skipped: true };
  }
  
  const streamRegex = /<<[^>]*\/Subtype\s*\/Image[^>]*>>\s*stream(?:\r\n|\n)/g;
  let match;
  const images = [];
  while ((match = streamRegex.exec(pdfStr)) !== null) {
    const dict = match[0];
    const hMatch = dict.match(/\/Height\s+(\d+)/);
    const wMatch = dict.match(/\/Width\s+(\d+)/);
    const height = hMatch ? parseInt(hMatch[1]) : 7016;
    const width = wMatch ? parseInt(wMatch[1]) : 4961;
    
    const start = match.index + match[0].length;
    const nextEndstream = pdfStr.indexOf('endstream', start);
    let streamData = pdfStr.substring(start, nextEndstream).trim();
    if (!streamData.startsWith('<~')) streamData = '<~' + streamData;
    if (!streamData.endsWith('~>')) streamData = streamData + '~>';
    
    images.push({ width, height, streamData });
  }
  
  if (images.length === 0) {
    fs.copyFileSync(inputPath, publicOutPath);
    return { origSize: pdfBuf.length, newSize: pdfBuf.length, pages: 0, skipped: false };
  }
  
  const newPdf = await PDFDocument.create();
  
  for (let i = 0; i < images.length; i++) {
    const { width, height, streamData } = images[i];
    const deflated = ascii85.decode(streamData);
    let rawRgb;
    try {
      rawRgb = zlib.inflateSync(deflated);
    } catch (e) {
      rawRgb = zlib.inflateRawSync(deflated);
    }
    
    // Resize to max 1200x1700, high quality web jpeg
    const jpegBuf = await sharp(rawRgb, { raw: { width, height, channels: 3 } })
      .resize({ width: 1200, height: 1700, fit: 'inside' })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
      
    const embeddedImage = await newPdf.embedJpg(jpegBuf);
    const page = newPdf.addPage([595.32, 841.92]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: 595.32,
      height: 841.92
    });
  }
  
  const optimizedBytes = await newPdf.save();
  fs.writeFileSync(publicOutPath, optimizedBytes);
  fs.writeFileSync(distOutPath, optimizedBytes);
  
  return {
    origSize: pdfBuf.length,
    newSize: optimizedBytes.length,
    pages: images.length,
    skipped: false
  };
}

async function runBatch() {
  const distDir = path.resolve(__dirname, '../app/dist/regulations');
  const publicDir = path.resolve(__dirname, '../app/public/regulations');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const files = fs.readdirSync(distDir).filter(f => f.endsWith('.pdf'));
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  
  console.log(`Starting/resuming web optimization for ${files.length} PDFs...`);
  
  let totalOrig = 0;
  let totalNew = 0;
  let totalPages = 0;
  
  for (let idx = 0; idx < files.length; idx++) {
    const f = files[idx];
    const inputPath = path.join(distDir, f);
    const publicOutPath = path.join(publicDir, f);
    const distOutPath = path.join(distDir, f);
    
    const startTime = Date.now();
    const result = await optimizeOnePdf(inputPath, publicOutPath, distOutPath);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    totalOrig += result.origSize;
    totalNew += result.newSize;
    totalPages += result.pages;
    
    const origMB = (result.origSize / (1024 * 1024)).toFixed(1);
    const newMB = (result.newSize / (1024 * 1024)).toFixed(1);
    
    if (result.skipped) {
      console.log(`[${idx + 1}/${files.length}] ${f.padEnd(10)} | ALREADY OPTIMIZED (${newMB}MB)`);
    } else {
      const ratio = (((result.origSize - result.newSize) / result.origSize) * 100).toFixed(0);
      console.log(`[${idx + 1}/${files.length}] ${f.padEnd(10)} | ${result.pages.toString().padStart(2)}p | ${origMB.padStart(5)}MB -> ${newMB.padStart(5)}MB (-${ratio}%) in ${elapsed}s`);
    }
  }
  
  console.log('\n======================================================');
  console.log(`Web Optimization Completed!`);
  console.log(`Total Files: ${files.length}`);
  console.log(`Total Pages Processed in Run: ${totalPages}`);
  console.log(`Final Total Size in public: ${(totalNew / (1024 * 1024)).toFixed(1)} MB`);
  console.log('======================================================\n');
}

runBatch().catch(err => {
  console.error('Batch optimization error:', err);
  process.exit(1);
});
