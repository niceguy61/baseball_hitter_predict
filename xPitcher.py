import requests
from bs4 import BeautifulSoup
import csv
import time

# CSV 파일 경로
yearly_output_file = 'kbo_pitchers_yearly.csv'

# CSV 파일에서 Position이 'P'인 선수들만 필터링
pitchers = []
with open('kbo_players.csv', 'r', encoding='utf-8') as file:
    for line in file:
        data = line.strip().split(',')
        if data[3] == 'P':  # Position이 'P'인 경우
            pitchers.append(data[0])  # p_no 추가

# 필터링된 선수들의 p_no를 사용하여 URL 생성 및 크롤링
for p_no in pitchers:
    yearly_url = f"https://statiz.sporki.com/player/?m=year&m2=pitching&m3=default&p_no={p_no}&lt=10100&gc="
    yearly_response = requests.get(yearly_url)

    if yearly_response.status_code == 200:
        yearly_soup = BeautifulSoup(yearly_response.text, 'html.parser')
        table = yearly_soup.select_one("body > div.warp > div.container > section > div.table_type02 > table")

        if table:
            rows = table.select('tbody tr')

            # CSV 파일에 연도별 기록 저장
            with open(yearly_output_file, mode='a', newline='', encoding='utf-8') as yearly_file_handle:
                yearly_writer = csv.writer(yearly_file_handle)

                # 헤더가 없으면 추가
                if yearly_file_handle.tell() == 0:
                    yearly_writer.writerow(['ID', 'Year', 'Team', 'Age', 'Pos.', 'G', 'GS', 'GR', 'GF', 'CG', 'SHO', 'W', 'L', 'S', 'HD', 'IP', 'ER', 'R', 'rRA', 'TBF', 'H', '2B', '3B', 'HR', 'BB', 'HP', 'IB', 'SO', 'ROE', 'BK', 'WP', 'ERA', 'RA9', 'rRA9', 'FIP', 'WHIP', 'WAR'])  # 헤더 추가

                for row in rows:
                    data = [p_no] + [td.text.strip() for td in row.select('td')]
                    yearly_writer.writerow(data)

            print(f"연도별 기록 크롤링 완료: p_no={p_no}")
        else:
            print(f"테이블을 찾을 수 없습니다: p_no={p_no}")
    else:
        print(f"연도별 기록 요청 실패: p_no={p_no}, 상태 코드={yearly_response.status_code}")

    time.sleep(0.1)  # 0.1초 대기 (필요에 따라 조정 가능)