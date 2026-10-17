import CFB from 'cfb';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';

export function extractTextFromHWP(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const cfb = CFB.read(fileBuffer, { type: 'buffer' });

  let fullText = '';

  for (const entry of cfb.FileIndex) {
    if (entry.name && entry.name.startsWith('Section') && entry.content) {
      let sectionBuffer = Buffer.from(entry.content);

      try {
        sectionBuffer = zlib.inflateRawSync(sectionBuffer);
      } catch (e) {
        try {
          sectionBuffer = zlib.inflateSync(sectionBuffer);
        } catch (e2) {
          // ignore
        }
      }

      let offset = 0;
      while (offset < sectionBuffer.length - 4) {
        const header = sectionBuffer.readUInt32LE(offset);
        const tagID = header & 0x3ff;
        let size = (header >> 20) & 0xfff;
        offset += 4;

        if (size === 0xfff) {
          if (offset + 4 > sectionBuffer.length) break;
          size = sectionBuffer.readUInt32LE(offset);
          offset += 4;
        }

        if (offset + size > sectionBuffer.length) break;

        // HWPTAG_PARA_TEXT = 67 (0x43)
        if (tagID === 67) {
          const textBuffer = sectionBuffer.slice(offset, offset + size);
          let text = '';
          for (let i = 0; i < textBuffer.length - 1; i += 2) {
            const charCode = textBuffer.readUInt16LE(i);
            if (charCode === 10 || charCode === 13) {
              text += '\n';
            } else if (charCode === 9) {
              text += '\t';
            } else if (charCode >= 32) {
              text += String.fromCharCode(charCode);
            }
          }
          if (text.trim()) {
            fullText += text.trim() + '\n';
          }
        }

        offset += size;
      }
    }
  }

  return fullText;
}

const hwpDir = path.resolve('../hwp_source');
const files = fs.readdirSync(hwpDir).filter(f => f.endsWith('.hwp'));
console.log(`Found ${files.length} HWP files in ${hwpDir}`);

const results = {};
for (const file of files) {
  // Extract rule code (e.g. "[NATURE]1.1 ..." -> "1.1")
  const match = file.match(/\[NATURE\]([0-9\.]+)/);
  const code = match ? match[1] : file;
  const filePath = path.join(hwpDir, file);
  try {
    const text = extractTextFromHWP(filePath);
    results[code] = {
      filename: file,
      code,
      textLength: text.length,
      text
    };
    console.log(`OK [${code}] length: ${text.length}`);
  } catch (err) {
    console.error(`ERR [${code}]:`, err.message);
  }
}

fs.writeFileSync(path.resolve('./src/data/hwp_extracted.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('Saved extracted texts to app/src/data/hwp_extracted.json');
