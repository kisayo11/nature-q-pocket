import json, re, os

def load_data():
    with open('app/src/data/rulesData.json', 'r', encoding='utf-8') as f:
        rules = json.load(f)
    with open('app/src/data/hwp_extracted.json', 'r', encoding='utf-8') as f:
        extracted = json.load(f)
    return rules, extracted

def check_rule_differences(rule, hwp_entry):
    code = rule['code']
    title = rule['title']
    full_text = hwp_entry.get('text', '')
    
    findings = []
    
    # 1. Check department alignment
    # Look for department in the header
    dept_line = ""
    lines = full_text.split('\n')
    for i, l in enumerate(lines[:35]):
        if any(keyword in l for keyword in ['담당부서', '담 당 부 서', '주관부서']):
            # next non-empty line
            for j in range(i+1, min(i+5, len(lines))):
                if lines[j].strip():
                    dept_line = lines[j].strip()
                    break
            break
            
    # 2. Check forms alignment
    # Forms mentioned in rule vs full_text
    rule_forms = rule.get('forms', [])
    missing_forms = []
    for form in rule_forms:
        # clean form name
        clean_f = re.sub(r'[\(\)\[\]\s]', '', form)
        if clean_f and clean_f not in re.sub(r'[\(\)\[\]\s]', '', full_text):
            missing_forms.append(form)
            
    # Check if there are newly added forms in the appendix (부록/서식)
    new_forms = []
    in_appendix = False
    for line in lines:
        if any(k in line for k in ['[부록]', '【부록】', '▣ 부록', '관련 서식', '부록.']):
            in_appendix = True
        if in_appendix:
            m = re.findall(r'(?:서식|기록지|대장|보고서|동의서|신청서|점검표|계획서|안내문|표지판)\b', line)
            if m and len(line) < 60:
                new_forms.append(line.strip())
                
    # 3. Check Golden Numbers & Key Points
    # E.g. Check numbers and periods mentioned in keyPoints
    key_points = rule.get('keyPoints', [])
    kp_discrepancies = []
    for kp in key_points:
        # Extract specific numbers with units (e.g. 24시간, 144시간, 28일, 51점, 2시간, 1년, etc.)
        num_units = re.findall(r'(\d+[\.\d]*\s*(?:시간|일|개월|년|점|℃|ppm|g|kg|ml|%|인|회))', kp)
        for nu in num_units:
            norm_nu = re.sub(r'\s+', '', nu)
            if norm_nu not in re.sub(r'\s+', '', full_text):
                kp_discrepancies.append(f"Number '{nu}' in keyPoint not found in new text")

    # 4. Check Title alignment
    # Check if title in HWP matches
    header_title = ""
    for l in lines[:10]:
        if code in l and len(l) < 50:
            header_title = l.strip()
            break

    return {
        'code': code,
        'title': title,
        'header_title': header_title,
        'hwp_dept_line': dept_line,
        'existing_depts': rule.get('department', []),
        'missing_forms': missing_forms,
        'potential_new_forms': list(set(new_forms))[:5],
        'kp_discrepancies': kp_discrepancies,
        'text_len': len(full_text)
    }

def main():
    rules, extracted = load_data()
    all_diffs = []
    for r in rules:
        code = r['code']
        hwp = extracted.get(code)
        if hwp:
            diff = check_rule_differences(r, hwp)
            all_diffs.append(diff)
            
    out_file = 'scratch/regulation_audit_report.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_diffs, f, ensure_ascii=False, indent=2)
    print(f"Audit completed for {len(all_diffs)} rules.")

if __name__ == '__main__':
    main()
