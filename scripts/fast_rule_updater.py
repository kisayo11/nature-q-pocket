# -*- coding: utf-8 -*-
"""
네이처요양병원 Q-Pocket 규정 초고속 원클릭 갱신 파이프라인 (Fast Rule Updater)
사용법:
    python scripts/fast_rule_updater.py 1.1 --push
    python scripts/fast_rule_updater.py 1.1 10.3 --push
    python scripts/fast_rule_updater.py 1.1 --diff-only
"""

import sys
import os
import io
import re
import argparse
import subprocess
import zipfile
import xml.etree.ElementTree as ET
import difflib

def get_base_dir():
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def extract_text_from_hwpx_bytes(b):
    try:
        z = zipfile.ZipFile(io.BytesIO(b))
    except Exception as e:
        return []
    texts = []
    sec_names = sorted([n for n in z.namelist() if n.startswith('Contents/section') and n.endswith('.xml')])
    for name in sec_names:
        tree = ET.fromstring(z.read(name))
        for elem in tree.iter():
            if elem.tag.endswith('}t') and elem.text:
                t = elem.text.strip()
                if t:
                    texts.append(t)
    return texts

def extract_text_from_file(path):
    with open(path, 'rb') as f:
        return extract_text_from_hwpx_bytes(f.read())

def find_hwpx_file(base_dir, code):
    hwp_dir = os.path.join(base_dir, 'hwp_source')
    pattern = re.compile(rf'^\[NATURE\]{re.escape(code)}(\s|\.).*\.hwpx$', re.IGNORECASE)
    for fname in os.listdir(hwp_dir):
        if pattern.match(fname):
            return os.path.join(hwp_dir, fname)
    # 느슨한 검색
    for fname in os.listdir(hwp_dir):
        if fname.startswith(f'[NATURE]{code}') and fname.endswith('.hwpx'):
            return os.path.join(hwp_dir, fname)
    return None

def analyze_diff(base_dir, hwpx_path, code):
    rel_path = os.path.relpath(hwpx_path, base_dir).replace('\\', '/')
    git_cmd = ['git', 'show', f'HEAD:{rel_path}']
    res = subprocess.run(git_cmd, capture_output=True, cwd=base_dir)
    old_texts = extract_text_from_hwpx_bytes(res.stdout) if res.returncode == 0 else []
    new_texts = extract_text_from_file(hwpx_path)

    print(f"\n============================================================")
    print(f"🔍 [규정 {code}] HWPX 텍스트 변경 정밀 분석")
    print(f"============================================================")
    print(f"파일 경로: {rel_path}")
    print(f"텍스트 블록: 이전 {len(old_texts)}개 ➔ 최신 {len(new_texts)}개")

    diff = list(difflib.unified_diff(
        old_texts, new_texts,
        fromfile=f'OLD(Git HEAD): {code}',
        tofile=f'NEW(WorkingTree): {code}',
        lineterm='', n=2
    ))

    if not diff:
        print("✓ 이전 버전 대비 본문 텍스트 변경 없음 (동일 파일)")
    else:
        print(f"📌 감지된 변경 라인 ({len(diff)}줄):")
        for line in diff[:60]:
            print("  " + line)
        if len(diff) > 60:
            print(f"  ... 외 {len(diff) - 60}줄 생략")

    # 부록 목록 추출
    appendices = [t for t in new_texts if '부록' in t and len(t) < 40]
    if appendices:
        print(f"\n📑 [부록 현황] ({len(appendices)}개 감지):")
        for app in appendices[:15]:
            print(f"   • {app}")

    return bool(diff)

def convert_hwpx_to_pdf(base_dir, hwpx_path, code):
    print(f"\n============================================================")
    print(f"🚀 [규정 {code}] rhwp 초고속 무인 PDF 변환 시작")
    print(f"============================================================")
    fname = os.path.basename(hwpx_path)
    base_name = os.path.splitext(fname)[0]
    
    app_pdf_dir = os.path.join(base_dir, 'app', 'public', 'regulations')
    pdf_source_dir = os.path.join(base_dir, 'pdf_source')
    os.makedirs(app_pdf_dir, exist_ok=True)
    os.makedirs(pdf_source_dir, exist_ok=True)

    dest_app_pdf = os.path.join(app_pdf_dir, f"{code}.pdf")
    dest_source_pdf = os.path.join(pdf_source_dir, f"{base_name}.pdf")

    # convert_single.py 호출
    script_path = os.path.join(base_dir, 'scripts', 'convert_single.py')
    cmd = [sys.executable, script_path, hwpx_path, dest_app_pdf, dest_source_pdf]
    res = subprocess.run(cmd, cwd=base_dir, capture_output=True, text=True)

    if res.returncode == 0:
        print(f"✓ PDF 변환 성공:")
        print(f"   ➔ 웹앱 배포: {os.path.relpath(dest_app_pdf, base_dir)}")
        print(f"   ➔ 원문 백업: {os.path.relpath(dest_source_pdf, base_dir)}")
        return True
    else:
        print(f"❌ PDF 변환 실패: {res.stderr}")
        return False

def sync_master_pipeline(base_dir):
    print(f"\n============================================================")
    print(f"⚡ 마스터 DB & 파이프라인 동기화 (sync_all_data.cjs)")
    print(f"============================================================")
    sync_script = os.path.join(base_dir, 'scripts', 'sync_all_data.cjs')
    res = subprocess.run(['node', sync_script], cwd=base_dir, capture_output=True, text=True)
    if res.returncode == 0:
        print(res.stdout.strip())
        return True
    else:
        print(f"❌ 동기화 실패: {res.stderr}")
        return False

def git_commit_and_push(base_dir, codes):
    print(f"\n============================================================")
    print(f"🌐 Git 스테이징, 커밋 및 푸시 (origin/main)")
    print(f"============================================================")
    # git add -u
    subprocess.run(['git', 'add', '-u'], cwd=base_dir, check=True)
    
    codes_str = ", ".join(codes)
    commit_msg = f"feat(regulations): {codes_str} HWPX 개정 반영 및 PDF/웹앱 자동 동기화"
    
    commit_res = subprocess.run(['git', 'commit', '-m', commit_msg], cwd=base_dir, capture_output=True, text=True)
    print(commit_res.stdout.strip())

    push_res = subprocess.run(['git', 'push', 'origin', 'main'], cwd=base_dir, capture_output=True, text=True)
    if push_res.returncode == 0:
        print(f"✓ GitHub 푸시 완료: {codes_str} (Vercel 자동 배포 트리거됨)")
        return True
    else:
        print(f"❌ 푸시 실패: {push_res.stderr}")
        return False

def main():
    parser = argparse.ArgumentParser(description="네이처요양병원 Q-Pocket 초고속 원클릭 규정 갱신 파이프라인")
    parser.add_argument('codes', nargs='+', help="갱신할 규정 코드 (예: 1.1 10.3)")
    parser.add_argument('--push', action='store_true', help="동기화 후 즉시 Git commit & push")
    parser.add_argument('--diff-only', action='store_true', help="PDF 변환 없이 diff 분석만 수행")
    parser.add_argument('--no-sync', action='store_true', help="sync_all_data.cjs 실행 건너뛰기")
    
    args = parser.parse_args()
    base_dir = get_base_dir()

    print(f"🚀 [Fast Rule Updater] 작업 시작: 대상 규정 {args.codes}")

    found_files = {}
    for code in args.codes:
        fpath = find_hwpx_file(base_dir, code)
        if not fpath:
            print(f"❌ 경고: 규정 {code}에 해당하는 HWPX 파일을 hwp_source/에서 찾을 수 없습니다.")
        else:
            found_files[code] = fpath

    if not found_files:
        print("처리할 파일이 없습니다. 종료합니다.")
        sys.exit(1)

    # 1. Diff 분석
    for code, fpath in found_files.items():
        analyze_diff(base_dir, fpath, code)

    if args.diff_only:
        print("\n✓ diff-only 모드 완료.")
        return

    # 2. PDF 변환
    convert_success = True
    for code, fpath in found_files.items():
        if not convert_hwpx_to_pdf(base_dir, fpath, code):
            convert_success = False

    # 3. 데이터 파이프라인 동기화
    if not args.no_sync:
        sync_master_pipeline(base_dir)

    # 4. Git Push
    if args.push:
        if convert_success:
            git_commit_and_push(base_dir, list(found_files.keys()))
        else:
            print("❌ PDF 변환 중 오류가 발생하여 푸시를 중단합니다.")

    print(f"\n🎉 [Fast Rule Updater] 모든 작업이 초고속으로 완료되었습니다!")

if __name__ == '__main__':
    main()
