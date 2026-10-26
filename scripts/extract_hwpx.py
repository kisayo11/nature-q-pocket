import zipfile, glob, re, json, os
import xml.etree.ElementTree as ET

def extract_hwpx_text(filepath):
    texts = []
    with zipfile.ZipFile(filepath, 'r') as z:
        sections = [n for n in z.namelist() if n.startswith('Contents/section')]
        sections.sort(key=lambda x: [int(c) if c.isdigit() else c for c in re.split(r'(\d+)', x)])
        for s in sections:
            xml_content = z.read(s)
            root = ET.fromstring(xml_content)
            for elem in root.iter():
                if elem.tag.endswith('}t') and elem.text:
                    t = elem.text.strip()
                    if t:
                        texts.append(t)
    return '\n'.join(texts)

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    hwp_dir = os.path.join(root_dir, 'hwp_source')
    app_data_dir = os.path.join(root_dir, 'app', 'src', 'data')
    
    files = sorted([f for f in os.listdir(hwp_dir) if f.startswith('[NATURE]') and f.endswith('.hwpx')])
    print(f"Found {len(files)} HWPX files in {hwp_dir}")
    
    results = {}
    for f in files:
        m = re.search(r'\[NATURE\]([0-9\.]+)', f)
        code = m.group(1) if m else f
        filepath = os.path.join(hwp_dir, f)
        text = extract_hwpx_text(filepath)
        results[code] = {
            'filename': f,
            'code': code,
            'textLength': len(text),
            'text': text
        }
        print(f"Extracted [{code}] {f} ({len(text)} chars)")
        
    out_path = os.path.join(app_data_dir, 'hwp_extracted.json')
    with open(out_path, 'w', encoding='utf-8') as out:
        json.dump(results, out, ensure_ascii=False, indent=2)
    print(f"\nSaved {len(results)} extracted rules to {out_path}")

if __name__ == '__main__':
    main()
