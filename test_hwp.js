import CFB from 'cfb';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';

function extractTextFromHWP(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const cfb = CFB.read(fileBuffer, { type: 'buffer' });

  let fullText = '';

  // Find all BodyText/Section streams
  for (const entry of cfb.FileIndex) {
    if (entry.name && entry.name.startsWith('Section') && entry.content) {
      let sectionBuffer = Buffer.from(entry.content);

      // Decompress if compressed (HWP BodyText sections are typically deflate compressed)
      try {
        sectionBuffer = zlib.inflateRawSync(sectionBuffer);
      } catch (e) {
        // Maybe uncompressed or standard inflate
        try {
          sectionBuffer = zlib.inflateSync(sectionBuffer);
        } catch (e2) {
          // Keep raw
        }
      }

      // Parse HWP records
      let offset = 0;
      while (offset < sectionBuffer.length - 4) {
        const header = sectionBuffer.readUInt32LE(offset);
        const tagID = header & 0x3ff;
        const level = (header >> 10) & 0x3ff;
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
            // Ignore control characters below 32 except newline/tab
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

const testFile = path.resolve('hwp_source/[NATURE]1.1 정확한 환자 확인 및 의사소통-ver.4-Learn it.hwp');
console.log('Testing extraction on:', testFile);
const text = extractTextFromHWP(testFile);
console.log('Extracted length:', text.length);
console.log('--- Sample Text (First 1500 chars) ---');
console.log(text.slice(0, 1500));
