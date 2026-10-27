import os
import time
import pymupdf
from pyhwpx import Hwp

def export_pdf():
    hwpx_path = r'c:\Users\ksang\Documents\handbook\hwp_source\4주기 요양병원인증 교육 핸드북(네이처요양병원)_완료.hwpx'
    out_pdf = r'c:\Users\ksang\Documents\handbook\app\public\nature_handbook_print.pdf'
    backup_pdf = r'c:\Users\ksang\Documents\handbook\app\public\nature_handbook_print_backup.pdf'
    
    if os.path.exists(out_pdf) and not os.path.exists(backup_pdf):
        import shutil
        shutil.copyfile(out_pdf, backup_pdf)
        print('Created backup of existing print PDF')
        
    print(f'Starting Hancom Office to convert: {hwpx_path}')
    hwp = Hwp(visible=False)
    try:
        hwp.open(hwpx_path)
        print('Opened HWPX successfully in Hancom Office')
        
        # Temporary output path first
        temp_pdf = r'c:\Users\ksang\Documents\handbook\scratch\handbook_export_temp.pdf'
        if os.path.exists(temp_pdf):
            os.remove(temp_pdf)
            
        try:
            hwp.save_as(temp_pdf, 'PDF')
        except Exception as e:
            print('Note: Expected COM RPC drop on PDF finish:', e)
            
        time.sleep(2)
        
        if os.path.exists(temp_pdf) and os.path.getsize(temp_pdf) > 0:
            print(f'Temp PDF created successfully, size: {os.path.getsize(temp_pdf)}')
            # Replace target PDF
            import shutil
            shutil.copyfile(temp_pdf, out_pdf)
            print(f'Copied to target: {out_pdf}, size: {os.path.getsize(out_pdf)}')
        else:
            raise RuntimeError('PDF export failed or file is empty')
            
    finally:
        try:
            hwp.quit()
        except:
            pass
            
    # Verify PDF with pymupdf
    print('\n=== Verifying Exported PDF ===')
    doc = pymupdf.open(out_pdf)
    print(f'Total Pages: {len(doc)}')
    
    targets = [
        '원내 필수 핵심 수치 요약',
        '7.7 감염성질환 환자관리',
        '부록: 조사위원 현장 구두질문 자가점검 리스트',
        '원내번호 900번',
        '4분 이내 제세동기',
        '휠체어 등 보행·이동 시 낙상방지',
        '보존식의 보관 : 매 끼니 식재료',
        'Spill Kit',
        '소독액 희석기준: 일상환경소독 락스 100배 희석(500ppm)'
    ]
    
    found_targets = {}
    for i, page in enumerate(doc):
        text = page.get_text()
        for t in targets:
            if t in text and t not in found_targets:
                found_targets[t] = i + 1
                
    for t in targets:
        if t in found_targets:
            print(f'  [PASS] Page {found_targets[t]}: "{t}"')
        else:
            print(f'  [FAIL] Missing: "{t}"')

if __name__ == '__main__':
    export_pdf()
