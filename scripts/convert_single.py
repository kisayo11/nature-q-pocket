import sys
import os
import shutil

if len(sys.argv) < 3:
    print("Usage: python convert_single.py <hwpx_file> <target1> [target2 ...]")
    sys.exit(1)

hwpx = os.path.abspath(sys.argv[1])
targets = [os.path.abspath(t) for t in sys.argv[2:]]
temp_pdf = os.path.abspath(r"scratch\temp_single.pdf")

if os.path.exists(temp_pdf):
    try:
        os.remove(temp_pdf)
    except:
        pass

print(f"Converting with rhwp: {hwpx}", flush=True)
converted = False

try:
    import rhwp
    doc = rhwp.parse(hwpx)
    doc.export_pdf(temp_pdf)
    if os.path.exists(temp_pdf) and os.path.getsize(temp_pdf) > 1000:
        converted = True
        print(f"✓ rhwp conversion successful ({os.path.getsize(temp_pdf):,} Bytes)", flush=True)
except Exception as e:
    print(f"rhwp failed ({e}), falling back...", flush=True)

if not converted:
    import time
    os.system("taskkill /f /im Hwp.exe >nul 2>nul")
    try:
        from pyhwpx import Hwp
        hwp = Hwp(visible=False)
        hwp.open(hwpx)
        hwp.save_as(temp_pdf, "PDF")
        time.sleep(2)
        hwp.quit()
    except Exception as e2:
        print(f"fallback error: {e2}")
    os.system("taskkill /f /im Hwp.exe >nul 2>nul")

if os.path.exists(temp_pdf) and os.path.getsize(temp_pdf) > 1000:
    size = os.path.getsize(temp_pdf)
    for target in targets:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copyfile(temp_pdf, target)
        print(f"✓ Copied ({size:,} Bytes) -> {target}", flush=True)
    try:
        os.remove(temp_pdf)
    except:
        pass
    print("✓ Conversion completed successfully.", flush=True)
else:
    print(f"❌ Failed to convert: {hwpx}", flush=True)
    sys.exit(1)