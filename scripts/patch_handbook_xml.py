import zipfile
import os
import copy
import xml.etree.ElementTree as ET

hp = '{http://www.hancom.co.kr/hwpml/2011/paragraph}'

def create_p(text, para_pr='0', char_pr='43', page_break='0'):
    p = ET.Element(f'{hp}p', {
        'id': '0',
        'paraPrIDRef': str(para_pr),
        'styleIDRef': '0',
        'pageBreak': str(page_break),
        'columnBreak': '0',
        'merged': '0'
    })
    run = ET.SubElement(p, f'{hp}run', {'charPrIDRef': str(char_pr)})
    t = ET.SubElement(run, f'{hp}t')
    t.text = text
    return p

def create_table_box(rows, tbl_id='2147109999'):
    row_cnt = len(rows)
    p_wrapper = ET.Element(f'{hp}p', {
        'id': '0',
        'paraPrIDRef': '26',
        'styleIDRef': '0',
        'pageBreak': '0',
        'columnBreak': '0',
        'merged': '0'
    })
    run = ET.SubElement(p_wrapper, f'{hp}run', {'charPrIDRef': '43'})
    tbl = ET.SubElement(run, f'{hp}tbl', {
        'id': str(tbl_id),
        'zOrder': '50',
        'numberingType': 'TABLE',
        'textWrap': 'TOP_AND_BOTTOM',
        'textFlow': 'BOTH_SIDES',
        'lock': '0',
        'dropcapstyle': 'None',
        'pageBreak': 'CELL',
        'repeatHeader': '1',
        'rowCnt': str(row_cnt),
        'colCnt': '1',
        'cellSpacing': '0',
        'borderFillIDRef': '3',
        'noAdjust': '0'
    })
    ET.SubElement(tbl, f'{hp}sz', {
        'width': '47622',
        'widthRelTo': 'ABSOLUTE',
        'height': str(row_cnt * 1000),
        'heightRelTo': 'ABSOLUTE',
        'protect': '0'
    })
    ET.SubElement(tbl, f'{hp}pos', {
        'treatAsChar': '1',
        'affectLSpacing': '0',
        'flowWithText': '1',
        'allowOverlap': '0',
        'holdAnchorAndSO': '0',
        'vertRelTo': 'PARA',
        'horzRelTo': 'PARA',
        'vertAlign': 'TOP',
        'horzAlign': 'LEFT',
        'vertOffset': '0',
        'horzOffset': '0'
    })
    ET.SubElement(tbl, f'{hp}outMargin', {'left': '141', 'right': '141', 'top': '141', 'bottom': '141'})
    ET.SubElement(tbl, f'{hp}inMargin', {'left': '510', 'right': '510', 'top': '141', 'bottom': '141'})
    
    for r_idx, (is_header, lines) in enumerate(rows):
        tr = ET.SubElement(tbl, f'{hp}tr')
        border_fill = '21' if is_header else '22'
        tc = ET.SubElement(tr, f'{hp}tc', {
            'name': '',
            'header': '0',
            'hasMargin': '0',
            'protect': '0',
            'editable': '0',
            'dirty': '0',
            'borderFillIDRef': border_fill
        })
        sub_list = ET.SubElement(tc, f'{hp}subList', {
            'id': '',
            'textDirection': 'HORIZONTAL',
            'lineWrap': 'BREAK',
            'vertAlign': 'CENTER',
            'linkListIDRef': '0',
            'linkListNextIDRef': '0',
            'textWidth': '0',
            'textHeight': '0',
            'hasTextRef': '0',
            'hasNumRef': '0'
        })
        
        para_pr = '80' if is_header else '91'
        char_pr = '60' if is_header else '48'
        
        for line in lines:
            p_elem = ET.SubElement(sub_list, f'{hp}p', {
                'id': '2147483648',
                'paraPrIDRef': para_pr,
                'styleIDRef': '0',
                'pageBreak': '0',
                'columnBreak': '0',
                'merged': '0'
            })
            r_elem = ET.SubElement(p_elem, f'{hp}run', {'charPrIDRef': char_pr})
            t_elem = ET.SubElement(r_elem, f'{hp}t')
            t_elem.text = line
            
        ET.SubElement(tc, f'{hp}cellAddr', {'colAddr': '0', 'rowAddr': str(r_idx)})
        ET.SubElement(tc, f'{hp}cellSpan', {'colSpan': '1', 'rowSpan': '1'})
        ET.SubElement(tc, f'{hp}cellSz', {'width': '47622', 'height': '500'})
        ET.SubElement(tc, f'{hp}cellMargin', {'left': '510', 'right': '510', 'top': '141', 'bottom': '141'})
        
    return p_wrapper

def create_banner_from_template(template_banner, title_text, page_break='1'):
    banner = copy.deepcopy(template_banner)
    banner.attrib['pageBreak'] = str(page_break)
    for t in banner.iter(f'{hp}t'):
        if t.text and ('7.6' in t.text or '급식' in t.text or '의료기관' in t.text):
            t.text = title_text
            break
    return banner

def create_dept_table_from_template(template_dept, dept_name, method_text='질문, 관찰, 자료확인'):
    dept_elem = copy.deepcopy(template_dept)
    # The template has two rows: row 0 is (조사부서, dept_name), row 1 is (조사방법, method_text)
    t_nodes = list(dept_elem.iter(f'{hp}t'))
    # Set dept name and method text
    found_dept = False
    found_method = False
    for i, t in enumerate(t_nodes):
        if not found_dept and t.text and ('영양' in t.text or '부서' in t.text and t.text != '조사부서'):
            t.text = dept_name
            found_dept = True
        elif not found_method and t.text and ('질문' in t.text or '관찰' in t.text):
            t.text = method_text
            found_method = True
    if not found_dept and len(t_nodes) >= 2:
        t_nodes[1].text = dept_name
    if not found_method and len(t_nodes) >= 4:
        t_nodes[3].text = method_text
    return dept_elem

def patch_handbook():
    hwpx_path = r'c:\Users\ksang\Documents\handbook\hwp_source\4주기 요양병원인증 교육 핸드북(네이처요양병원)_pretendard_수정완료.hwpx'
    print(f'Reading HWPX: {hwpx_path}')
    
    with zipfile.ZipFile(hwpx_path, 'r') as z:
        all_files = {name: z.read(name) for name in z.namelist()}
        
    section_xml = all_files['Contents/section0.xml'].decode('utf-8')
    root = ET.fromstring(section_xml)
    children = list(root)
    print(f'Original direct children count: {len(children)}')
    
    # Templates for banner and dept tables from 7.6
    banner_template = children[310]
    dept_template = children[311]
    
    # -------------------------------------------------------------
    # 1. Update existing sections:
    # -------------------------------------------------------------
    print('Updating existing sections...')
    
    # 1-1. 3.2.1 CPR (in children[173])
    for p in children[173].findall(f'.//{hp}p'):
        for t in p.findall(f'.//{hp}t'):
            if t.text:
                if '원내번호 900번' in t.text:
                    t.text = '원내번호 900번(원무과)으로 즉시 전화하여 응급 비상방송(코드블루) 의뢰'
                elif '3~4분 이내 사용할 수 있는 거리에 비치한다' in t.text:
                    t.text = '입원 및 진료 영역에서는 골든타임 4분 이내 제세동기를 즉시 현장에 도착·적용할 수 있도록 비치·관리한다.'
                elif '필요 시 보호구를 착용하며' in t.text and '인공호흡' in t.text:
                    t.text = '※필요 시 보호구를 착용하며(감염 의심 시 KF94, 보안경, 가운 착용 에어로졸 차단) 인공호흡은 Ambu-bag을 사용한다.'
    
    # 1-2. 3.2.3 Restraint (in children[192])
    for p in children[192].findall(f'.//{hp}p'):
        for t in p.findall(f'.//{hp}t'):
            if t.text and '바. 이동시에 한해 낙상의 방지를 위한 보호대 적용 시' in t.text:
                t.text = '바. 단, 휠체어 등 보행·이동 시 낙상방지를 위해 일시 착용하는 안전벨트는 신체보호대가 아닌 단순 낙상예방 보조기구이므로 신체보호대 동의서 징구 대상에서 제외된다. 반면 환자의 신체 부위를 묶어 행동을 제한하는 신체보호대(손발 억제대 등) 적용 시에는 반드시 의사 1일 1회 처방 및 사전 서면 동의서 징구가 필수적이다.'
                
    # 1-3. 7.4 Environment (in children[306])
    # Add dilution and 24h labeling to 7.4
    tbl_74 = children[306].find(f'.//{hp}tbl')
    if tbl_74 is not None:
        trs = tbl_74.findall(f'{hp}tr')
        if len(trs) >= 2:
            body_tc = trs[1].find(f'{hp}tc')
            sublist = body_tc.find(f'{hp}subList')
            if sublist is not None:
                p_dilution = ET.SubElement(sublist, f'{hp}p', {
                    'id': '2147483648',
                    'paraPrIDRef': '91',
                    'styleIDRef': '0',
                    'pageBreak': '0',
                    'columnBreak': '0',
                    'merged': '0'
                })
                r_dilution = ET.SubElement(p_dilution, f'{hp}run', {'charPrIDRef': '48'})
                t_dilution = ET.SubElement(r_dilution, f'{hp}t')
                t_dilution.text = '바. 소독액 희석기준: 일상환경소독 락스 100배 희석(500ppm), 혈액·체액오염 락스 10배 희석(5,000ppm). 희석 소독액은 당일 제조하여 24시간 이내 사용(라벨링 필수).'
                
    # 1-4. 7.6 Food (in children[313])
    # Fix typo '휴뮤일' -> '휴무일' and add '150g'
    for p in children[313].findall(f'.//{hp}p'):
        for t in p.findall(f'.//{hp}t'):
            if t.text and '보존식의 보관' in t.text:
                t.text = '보존식의 보관 : 매 끼니 식재료 및 완성품을 전용 용기에 각 메뉴별 약 150g 이상 채취하여 -18℃ 이하의 냉동고에서 144시간(휴무일 구분 없이 7일) 동안 보관하며 완제품인 경우 그대로 보관한다.'

    # 1-5. 10.3 Spill Kit (in children[389, 393, 395])
    for idx in range(388, 400):
        for p in children[idx].findall(f'.//{hp}p'):
            for t in p.findall(f'.//{hp}t'):
                if t.text:
                    if '개인보호구(마스크, 가운, 장갑)을 착용한다' in t.text:
                        t.text = '- 주황색 의료폐기물 봉지를 벌린 후 개인보호구(KF94마스크, 보안경/고글, 가운, 장갑)를 착용한다.'
                    elif '약 5,000ppm' in t.text:
                        t.text = '소독제 희석방법 : 물 90mL + 유한락스 원액 10mL = 총 100mL (10배 희석, 약 5,000ppm)'
                        
    # 1-6. 10.6 Fire (in children[454])
    for p in children[454].findall(f'.//{hp}p'):
        for t in p.findall(f'.//{hp}t'):
            if t.text and ': 원무과(내선900)에 화재사실 연락' in t.text:
                t.text = ': 원무과(내선900번)에 화재발생 위치 및 상황 즉시 연락 (야간/휴일은 당직실 통보)'

    # -------------------------------------------------------------
    # 2. Build New Elements:
    # -------------------------------------------------------------
    
    # 2-1. "원내 필수 핵심 수치 요약" (Insert before Chapter 1.1)
    cheat_banner = create_banner_from_template(banner_template, '원내 필수 핵심 수치 요약', page_break='1')
    cheat_dept = create_dept_table_from_template(
        dept_template, 
        '전 부서 공통 (간호부, 진료부, 행정부, 영양실, 시설/미화)', 
        '인증평가 현장 3초 즉답 필수 기준 및 핵심 수치 암기'
    )
    
    cheat_rows = [
        (True, ['1. 시간 관리 골든타임 (반드시 외워야 할 시간 수치)']),
        (False, [
            '• 구두·전화처방 : 응급처치 후 의사 전산입력 24시간 이내 완료, 확인 후 간호사 기록지 파쇄 폐기',
            '• 환자 초기평가 : 입원 후 24시간 이내 완료 (영양 초기평가는 48시간 이내)',
            '• 신체보호대 : 최소 2시간마다 상태 관찰 및 기록, 원거리 보호자 구두동의 시 7일 이내 서면 전환',
            '• 급식 보존식 : -18℃ 이하 전용 냉동고에서 144시간(휴무일 포함 7일) 동안 냉동 보관',
            '• 희석 소독액 : 락스 희석액은 당일 제조하여 24시간 이내 사용 원칙 (제조일시 라벨링 부착)'
        ]),
        (True, ['2. 핵심 평가 척도 및 기준치']),
        (False, [
            '• Morse 낙상 위험도 : 51점 이상 고위험군 (침상/차트 붉은색 스티커, 진정제·마약류 투여 시 즉시 재평가)',
            '• Braden 욕창 위험도 : 12점 이하 고위험군 (9점 이하 초고위험군은 에어매트리스 필수 + 2시간 체위변경)',
            '• 통증 재평가 종료 : 중재 후(경구 1시간 / 주사 30분) 평가 시행, 2점 이하 도달 시 재평가 종료',
            '• 자동제세동기(AED) : 심정지 환자 발생 시 골든타임 4분 이내 도착 및 현장 적용'
        ]),
        (True, ['3. 온도 및 보관 기준']),
        (False, [
            '• 의약품 냉장고 : 2 ~ 8 ℃ 유지 (매일 2회 점검 및 온도기록부 작성)',
            '• 실온 보관 : 1 ~ 30 ℃ / 상온 보관 : 15 ~ 25 ℃',
            '• 식자재 보관 창고 : 15 ~ 25 ℃ (습도 50 ~ 60% 이하 유지)',
            '• 조리 후 배식 완료 : 조리 완료 시각으로부터 2시간 이내 배식 완료'
        ]),
        (True, ['4. 개봉 의약품 유효기간 라벨링 원칙']),
        (False, [
            '• 인슐린 주사제 / 점안액(안약) : 개봉일로부터 28일간 (개봉일·폐기예정일 라벨링)',
            '• 시럽제 : 소분의약품은 소분일로부터 1개월(30일) / 원포장 개봉은 6개월간',
            '• 정제(알약) : 조제일로부터 1년간 / 산제(가루약) : 분쇄·소분 조제일로부터 6개월간',
            '• 환경 소독티슈 : 개봉일로부터 3개월간 (개봉일자 라벨링 부착)'
        ]),
        (True, ['5. 비상 연락망 및 필수 내선번호']),
        (False, [
            '• 심폐소생술(코드블루) / 화재 비상방송 : 원무과 내선 900번 (야간/휴일: 당직실)',
            '• 원내 폭력(코드블랙) : 내선 901번 / 원내 도난 : 내선 923번',
            '• 노인학대 신고전화 : 1577-1389 (노인보호전문기관) 또는 112 (경찰청)'
        ])
    ]
    cheat_box = create_table_box(cheat_rows, tbl_id='2147101111')

    # 2-2. "7.7 감염성질환 환자관리" (Insert right between 7.6 and 8.2)
    inf_banner = create_banner_from_template(banner_template, '7.7 감염성질환 환자관리', page_break='1')
    inf_dept = create_dept_table_from_template(
        dept_template,
        '전 부서 (간호부, 진료부, 감염관리실)',
        '질문, 관찰, 자료확인'
    )
    
    inf_rows = [
        (True, ['1. 격리 원칙 및 감염병 격리주의 유형']),
        (False, [
            '가. 공기주의 (활동성 결핵, 홍역, 수두 등):',
            '  • 본원 음압격리실 부재로 1인실(공조기 차단, 자연환기) 격리 후 상급병원 신속 전원 조치.',
            '  • 의료진 및 직원은 병실 출입 시 밀착도 검사를 거친 N95 마스크 필수 착용.',
            '나. 비말주의 (인플루엔자 등):',
            '  • 1인실 격리 또는 코호트 격리하며, 환자와 1m 이내 밀접 접촉 시 외과용 마스크 착용.',
            '다. 접촉주의 (CRE, VRE 등 다제내성균):',
            '  • 병실 입구에 접촉주의 표지판 부착 및 전용 혈압계·청진기·체온계 병실 내 비치.',
            '  • 병실 출입 시 일회용 가운과 장갑 착용 필수, 환자 접촉 전·후 물과 비누/손소독제 손위생 철저.',
            '  • 다제내성균 격리실 환경소독은 락스 대신 전용 소독티슈(고수준 표면소독제)를 사용하여 1일 1회 이상 표면 소독.',
            '라. 격리 해제 기준:',
            '  • VRE: 1주일 간격으로 시행한 연속 3회 배양 검사에서 모두 음성 확인 시 주치의 격리해제 처방.'
        ]),
        (True, ['2. 옴(Scabies) 환자 감염관리']),
        (False, [
            '가. 의심 즉시 1인실 격리 조치하고 주치의 진단 하에 치료제(린단/오메크린)를 목 이하 전신에 도포.',
            '나. 연고 도포 후 24시간 동안 격리를 엄격히 유지하며, 해당 직원은 대민 접촉 업무에서 배제.',
            '다. 환자가 사용한 침구류 및 의류는 60℃ 이상의 온수로 세탁하거나 비닐백에 밀봉하여 72시간 이상 격리 보관 후 세탁.',
            '라. 간병 및 간호 처치 직원은 일회용 가운과 장갑 등 개인보호구를 반드시 착용.'
        ]),
        (True, ['3. 개인보호구 착·탈의 순서']),
        (False, [
            '가. 착용 순서 : 가운 입기 ➔ 마스크(N95/외과용) ➔ 보안경(고글) ➔ 장갑 착용',
            '나. 탈의 순서 : 장갑 벗기 ➔ 보안경(고글) 벗기 ➔ 가운 벗기 ➔ 마스크 벗기 ➔ 손위생 실시!',
            '※ 오염된 보호구의 겉면이 신체나 의복에 닿지 않도록 주의하여 의료폐기물 전용용기에 폐기한다.'
        ])
    ]
    inf_box = create_table_box(inf_rows, tbl_id='2147107777')

    # 2-3. "부록: 조사위원 현장 구두질문 자가점검 리스트" (Insert before back cover)
    quiz_banner = create_banner_from_template(banner_template, '부록: 조사위원 현장 구두질문 자가점검 리스트', page_break='1')
    quiz_dept = create_dept_table_from_template(
        dept_template,
        '전 직원 (직종별 자가점검)',
        '질문 확인 후 즉각 구두 답변 가능 여부 점검 (답변 제외, 질문 숙지용)'
    )
    
    quiz_rows = [
        (True, ['1. 간호부 (간호사) 핵심 기습 질문 10선']),
        (False, [
            'Q1. 구두·전화처방 4단계 절차와 의사 전산입력 완료 시한은 얼마인가요?',
            'Q2. Morse 낙상평가 고위험군 기준 점수와 비정기 재평가를 즉시 시행해야 하는 시점은?',
            'Q3. Braden 욕창평가 고위험군 점수와 9점 이하 초고위험군에게 적용하는 특별 중재는?',
            'Q4. 심정지 환자 발견 시 코드블루 방송 요청 내선번호와 AED 목표 적용 시간은?',
            'Q5. 신체보호대 의사 처방 주기와 상태 관찰 주기, 원거리 보호자 구두동의 전환 시한은?',
            'Q6. 의약품 냉장고 적정 보관 온도와 인슐린 주사제 개봉 후 유효기간은 얼마인가요?',
            'Q7. VRE/CRE 환자 병실 출입 시 착용해야 하는 보호구와 환경소독 방법은 무엇인가요?',
            'Q8. 혈액 또는 체액이 바닥에 쏟아졌을 때 Spill Kit 사용 절차는 어떻게 되나요?',
            'Q9. 화재 발생 시 내선 몇 번으로 통보하며, RACE 행동원칙은 각각 무엇을 의미하나요?',
            'Q10. 수혈 시 혈액백 확인 절차(2인 확인)와 수혈 시작 후 부작용 관찰 주기는?'
        ]),
        (True, ['2. 간병사 / 요양보호사 핵심 기습 질문 6선']),
        (False, [
            'Q11. 올바른 손위생 6단계 방법과 물과 비누/손소독제 사용 시 권장 소요 시간은?',
            'Q12. 와상 환자의 체위변경은 최소 몇 시간마다 시행해야 하나요?',
            'Q13. 낙상 고위험 환자를 휠체어로 이동시킬 때 반드시 지켜야 할 안전수칙은?',
            'Q14. 휠체어 안전벨트와 신체보호대의 차이점은 무엇인가요?',
            'Q15. 옴(Scabies) 의심 환자 간병 시 주의사항과 보호구 착용법은 무엇인가요?',
            'Q16. 병실에서 연기나 화재를 목격했을 때 가장 먼저 어떻게 행동해야 하나요?'
        ]),
        (True, ['3. 진료부 (의사 / 한의사) 핵심 기습 질문 4선']),
        (False, [
            'Q17. 당직 시 구두처방이 허용되는 예외 사유와 처방 전산입력 법적 기한은?',
            'Q18. 신체보호대 처방 시 필수 기재 항목과 1회 처방의 유효기간은?',
            'Q19. 한방 침술 및 부항 시술 시 1회용 멸균품 사용 원칙과 침훈 발생 시 대처법은?',
            'Q20. 다제내성균(VRE) 환자의 격리 해제 처방 기준(배양검사 횟수 및 주기)은?'
        ]),
        (True, ['4. 영양팀 / 조리실 핵심 기습 질문 4선']),
        (False, [
            'Q21. 보존식 채취 대상, 1회 채취 용량(g), 보관 온도 및 보관 시간 기준은?',
            'Q22. 식재료 교차오염 방지를 위한 칼·도마 5가지 색상 구분 기준은?',
            'Q23. 조리 완료 시각으로부터 환자 배식 완료까지의 허용 시간은 몇 시간 이내인가요?',
            'Q24. 조리 종사자에게 설사, 발열 등 감염 증상 발생 시 어떤 조치를 취하나요?'
        ]),
        (True, ['5. 원무 / 행정 / 시설 / 미화 핵심 기습 질문 6선']),
        (False, [
            'Q25. 입원 환자 확인 2가지 지표와 환자인식밴드 발급 및 부착 절차는?',
            'Q26. 병동에서 비상방송(코드블루, 화재 등) 요청이 왔을 때 원무과의 방송 절차는?',
            'Q27. 개인정보가 포함된 문서(구두처방 기록지, 차트 사본 등)의 파쇄 폐기 기준은?',
            'Q28. 일상 환경소독 소독액 희석 농도(ppm)와 혈액오염 시 희석 농도 및 유효기간은?',
            'Q29. 소화기 및 옥내소화전 사용 방법(PASS 원칙)을 시연해 보세요.',
            'Q30. 비상발전기 무부하 및 부하운전 점검 주기는 어떻게 되나요?'
        ])
    ]
    quiz_box = create_table_box(quiz_rows, tbl_id='2147109990')

    # -------------------------------------------------------------
    # 3. Assemble document with correct ordering:
    # -------------------------------------------------------------
    print('Assembling document tree...')
    
    # Let's locate the exact insertion indices in children list:
    idx_1_1 = None
    idx_8_2 = None
    idx_11_3 = None
    
    for i, c in enumerate(children):
        t = ''.join(c.itertext()).strip()
        if '1.1 의료진간' in t and idx_1_1 is None:
            idx_1_1 = i
        elif '8.2 의료기관' in t and idx_8_2 is None:
            idx_8_2 = i
        elif '11.3 개인정보' in t and idx_11_3 is None:
            idx_11_3 = i
            
    print(f'Detected indices: 1.1 at {idx_1_1}, 8.2 at {idx_8_2}, 11.3 at {idx_11_3}')
    
    # Construct new children list:
    new_children = []
    
    # 1. Everything before 1.1
    new_children.extend(children[:idx_1_1])
    
    # 2. Insert "원내 필수 핵심 수치 요약"
    new_children.append(cheat_banner)
    new_children.append(cheat_dept)
    new_children.append(cheat_box)
    
    # 3. From 1.1 up to just before 8.2 (including 7.6)
    new_children.extend(children[idx_1_1:idx_8_2])
    
    # 4. Insert 7.7 (right after 7.6, before 8.2)
    new_children.append(inf_banner)
    new_children.append(inf_dept)
    new_children.append(inf_box)
    
    # 5. From 8.2 to end of 11.3
    # Find end of 11.3 content (before the trailing blank paragraphs and back cover)
    # The back cover has '로고 직사각형.png'
    back_cover_start = len(children)
    for i in range(idx_11_3, len(children)):
        t = ''.join(children[i].itertext()).strip()
        if '로고 직사각형' in t or '원본 그림의 이름' in t:
            back_cover_start = i
            break
            
    print(f'Back cover starts at {back_cover_start}')
    new_children.extend(children[idx_8_2:back_cover_start])
    
    # 6. Insert "부록: 조사위원 현장 구두질문 자가점검 리스트"
    new_children.append(quiz_banner)
    new_children.append(quiz_dept)
    new_children.append(quiz_box)
    
    # 7. Back cover
    new_children.extend(children[back_cover_start:])
    
    print(f'New children count: {len(new_children)}')
    
    # Rebuild root
    root.clear()
    for c in new_children:
        root.append(c)
        
    new_xml = ET.tostring(root, encoding='utf-8', xml_declaration=True)
    all_files['Contents/section0.xml'] = new_xml
    
    # Write back to HWPX
    with zipfile.ZipFile(hwpx_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, data in all_files.items():
            z.writestr(name, data)
            
    print(f'Successfully updated HWPX: {hwpx_path}, size: {os.path.getsize(hwpx_path)}')

if __name__ == '__main__':
    patch_handbook()
