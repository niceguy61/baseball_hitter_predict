import boto3
import csv

# DynamoDB 리소스 생성
dynamodb = boto3.resource('dynamodb')

# 테이블 이름
batter_table = dynamodb.Table('kbo_batter_stat')
player_table = dynamodb.Table('kbo_player')
pitcher_table = dynamodb.Table('kbo_pitcher_stat')

batter_headers = [
    "id", "Year", "Team", "Age", "Pos.", "oWAR", "dWAR", "G", "PA", "ePA", 
    "AB", "R", "H", "2B", "3B", "HR", "TB", "RBI", "SB", "CS", 
    "BB", "HP", "IB", "SO", "GDP", "SH", "SF", "AVG", "OBP", 
    "SLG", "OPS", "R/ePA", "wRC+", "WAR"
]

pitcher_headers = [
    "id", "Year", "Team", "Age", "Pos.", "G", "GS", "GR", "GF", "CG",
    "SHO", "W", "L", "S", "HD", "IP", "ER", "R", "rRA", "TBF",
    "H", "2B", "3B", "HR", "BB", "HP", "IB", "SO", "ROE", "BK",
    "WP", "ERA", "RA9", "rRA9", "FIP", "WHIP", "WAR"
]

# kbo_player.csv 데이터 삽입
# with open('kbo_players.csv', 'r', encoding='utf-8') as file:
#     reader = csv.reader(file)
#     for row in reader:
#         player_data = {
#             "id": row[0],
#             "name": row[1],
#             "team": row[2] if row[2] else "Unknown",
#             "position": row[3],
#             "bats": row[4],
#             "school": row[5],
#             "image_url": row[6],
#             "draft_info": row[7],
#             "career": row[8]
#         }
#         if not player_data["team"]:
#             print(f"Skipping player with empty team: {player_data['name']}")
#             continue
#         player_table.put_item(Item=player_data)



# with open('kbo_batters_yearly.csv', 'r', encoding='utf-8') as file:
#     reader = csv.reader(file)
#     for row in reader:
#         # 모든 값에 대해 비어있으면 "0" 처리
#         batter_data = {batter_headers[i]: (row[i] if i < len(row) and row[i] else "0") for i in range(len(batter_headers))}
#         batter_table.put_item(Item=batter_data)

# kbo_batter_yearly.csv 데이터 삽입

with open('kbo_pitchers_yearly.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    for row in reader:
        # 모든 값에 대해 비어있으면 "0" 처리
        pitcher_data = {pitcher_headers[i]: (row[i] if i < len(row) and row[i] else "0") for i in range(len(pitcher_headers))}
        pitcher_table.put_item(Item=pitcher_data)