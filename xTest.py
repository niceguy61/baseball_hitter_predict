import requests
from bs4 import BeautifulSoup
import csv
import time

# CSV 파일로 저장
output_file = 'kbo_players.csv'

# CSV 파일 초기화
with open(output_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['ID', 'Name', 'Team', 'Position', 'Birth Date', 'School', 'Photo URL', 'Draft Info', 'Active Years'])

# p_no를 1부터 20000까지 루프
for p_no in range(1000, 20001):
    url = f"https://statiz.sporki.com/player/?m=playerinfo&p_no={p_no}"  # 타자 데이터 URL
    response = requests.get(url)

    # HTTP 요청이 성공했는지 확인
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # 선수 기본 정보 추출
        player_name = soup.select_one("body > div.warp > div.container > section > div.player_info_header > div.bio.type01 > div.in_box > div.p_info > div.name")
        if player_name is None:
            print(f"선수 정보 없음: p_no={p_no}")
            continue  # 선수 정보가 없으면 다음 번호로 넘어감

        player_name = player_name.text.strip()  # 선수 이름
        team = soup.select_one("div.p_info > div.con > span:nth-child(1)").text.strip()  # 팀
        position = soup.select_one("div.p_info > div.con > span:nth-child(2)").text.strip()  # 포지션
        birth_date = soup.select_one("div.p_info > div.con > span:nth-child(3)").text.strip()  # 생년월일

        # 출신학교 추출
        school_element = soup.select_one("body > div.warp > div.container > section > div.player_info_header > div.bio.type01 > div.in_box > ul > li:nth-child(2)")
        school = school_element.text.strip() if school_element else "정보 없음"  # 출신학교

        # 드래프트 정보 및 활약 연도 추출
        draft_info = soup.select_one("body > div.warp > div.container > section > div.player_info_header > div.bio.type01 > div.in_box > ul > li:nth-child(3)")
        draft_info = draft_info.text.strip() if draft_info else "정보 없음"  # 신인지명

        active_years = soup.select_one("body > div.warp > div.container > section > div.player_info_header > div.bio.type01 > div.in_box > ul > li:nth-child(4)")
        active_years = active_years.text.strip() if active_years else "정보 없음"  # 활약연도

        # 사진 경로 추출 및 URL 추가
        photo_element = soup.select_one("body > div.warp > div.container > section > div.player_info_header > div.bio.type01 > div.in_box > div.profile_img02 > img")
        photo_url = f"https://statiz.sporki.com{photo_element['src']}" if photo_element else "사진 없음"  # 사진 경로

        # CSV에 선수 정보 기록 (한 줄씩)
        with open(output_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([p_no, player_name, team, position, birth_date, school, photo_url, draft_info, active_years])
        
        print(f"크롤링 완료: p_no={p_no}, 이름={player_name}")
        
        # 실시간 확인을 위해 잠시 대기
        time.sleep(0.1)  # 0.1초 대기 (필요에 따라 조정 가능)
    else:
        print(f"HTTP 요청 실패: p_no={p_no}, 상태 코드={response.status_code}")
