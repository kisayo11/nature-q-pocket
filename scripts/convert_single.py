import sys
import os
import time
import shutil
import threading

if len(sys.argv) < 3:
    print("Usage: python convert_single.py <hwpx_file> <target1> [target2 ...]")
    sys.exit(1)

hwpx = os.path.abspath(sys.argv[1])
targets = [os.path.abspath(t) for t in sys.argv[2:]]
temp_pdf = os.path.abspath(r'scratch\temp_single.pdf')

if os.path.exists(temp_pdf):
    try:
        os.remove(temp_pdf)
    except:
        pass

os.system('taskkill /f /im Hwp.exe >nul 2>nul')
time.sleep(0.5)

# Watcher thread that kills Hwp once temp_pdf is created and fully written
def watcher():
    last_sz = -1
    stable_count = 0
    for _ in range(60): # up to 30s
        time.sleep(0.5)
        if os.path.exists(temp_pdf):
            sz = os.path.getsize(temp_pdf)
            if sz > 1000 and sz == last_sz:
                stable_count += 1
                if stable_count >= 2: # size stable for 1 second!
                    time.sleep(0.5)
                    os.system('taskkill /f /im Hwp.exe >nul 2>nul')
                    return
            else:
                last_sz = sz
                stable_count = 0

t = threading.Thread(target=watcher, daemon=True)
t.start()

print(f"Converting: {hwpx}", flush=True)
try:
    from pyhwpx import Hwp
    hwp = Hwp(visible=False)
    hwp.open(hwpx)
    time.sleep(0.5)
    try:
        hwp.save_as(temp_pdf, 'PDF')
    except:
        pass
except Exception as e:
    pass

# Ensure Hwp is dead
os.system('taskkill /f /im Hwp.exe >nul 2>nul')
time.sleep(1.0)

if os.path.exists(temp_pdf) and os.path.getsize(temp_pdf) > 0:
    size = os.path.getsize(temp_pdf)
    for target in targets:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        copied = False
        for attempt in range(10):
            try:
                shutil.copyfile(temp_pdf, target)
                copied = True
                print(f"✓ Copied ({size:,} Bytes) -> {target}", flush=True)
                break
            except PermissionError:
                time.sleep(0.5)
        if not copied:
            print(f"❌ Failed to copy to {target}", flush=True)
            sys.exit(1)
    for _ in range(5):
        try:
            os.remove(temp_pdf)
            break
        except:
            time.sleep(0.5)
    print("✓ Conversion completed successfully.", flush=True)
else:
    print(f"❌ Failed to convert: {hwpx}", flush=True)
    sys.exit(1)
