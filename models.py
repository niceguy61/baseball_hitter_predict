import pandas as pd
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal, InvalidOperation

# DynamoDB 클라이언트 생성
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('baseball-predict')  # 테이블 이름

def load_data(file_path):
    data = pd.read_csv(file_path)
    data.fillna(0, inplace=True)
    
    # DynamoDB에 데이터 삽입
    insert_data_to_dynamodb(data)
    
    # wOBA 계산
    # data = calculate_woba(data)
    
    return "OK"

def convert_to_decimal(value):
    """Convert a value to Decimal, handling empty or invalid values."""
    if pd.isna(value) or value == '':
        return Decimal(0)  # 빈 값은 0으로 처리
    try:
        return Decimal(str(value))
    except InvalidOperation:
        print(f"Invalid value for Decimal conversion: {value}")
        return Decimal(0)  # 변환할 수 없는 값은 0으로 처리

def insert_data_to_dynamodb(data):
    for index, row in data.iterrows():
        item = {
            'label': row['label'],  # 기본 키
            'player_name': row['player_name'],
            'team': row['team'],
            'year': str(row['year']),
            'home_run_rate': convert_to_decimal(row['home_run_rate']),
            'batting_side': row['batting_side'],
            'throwing_hand': row['throwing_hand'],
            'height': row['height'],
            'weight': convert_to_decimal(row['weight']),
            'age': convert_to_decimal(row['age']),
            'G': convert_to_decimal(row['G']),
            'PA': convert_to_decimal(row['PA']),
            'AB': convert_to_decimal(row['AB']),
            'R': convert_to_decimal(row['R']),
            'H': convert_to_decimal(row['H']),
            '2B': convert_to_decimal(row['2B']),
            '3B': convert_to_decimal(row['3B']),
            'HR': convert_to_decimal(row['HR']),
            'RBI': convert_to_decimal(row['RBI']),
            'SB': convert_to_decimal(row['SB']),
            'CS': convert_to_decimal(row['CS']),
            'BB': convert_to_decimal(row['BB']),
            'SO': convert_to_decimal(row['SO']),
            'batting_avg': convert_to_decimal(row['batting_avg']),
            'onbase_perc': convert_to_decimal(row['onbase_perc']),
            'slugging_perc': convert_to_decimal(row['slugging_perc']),
            'IBB': convert_to_decimal(row['IBB']),
            'onbase_plus_slugging': convert_to_decimal(row['onbase_plus_slugging']),
            'TB': convert_to_decimal(row['TB']),
            'GIDP': convert_to_decimal(row['GIDP']),
            'HBP': convert_to_decimal(row['HBP']),
            'SH': convert_to_decimal(row['SH']),
            'SF': convert_to_decimal(row['SF'])
        }
        
        try:
            table.put_item(Item=item)
        except ClientError as e:
            print(f"Error inserting item {row['label']}: {e.response['Error']['Message']}")

def calculate_woba(data):
    # wOBA 계산을 위한 가중치
    weights = {
        'H': 0.475,
        '2B': 0.776,
        '3B': 1.070,
        'HR': 1.397,
        'BB': 0.323,
        'HBP': 0.352,
        'SB': 0.175,
        'CS': -0.467,
        'SF': 0.0,
        'Bunt': 0.042,
    }

    # wOBA 계산
    data['wOBA'] = (
        (data['H'] * weights['H'] +
         data['2B'] * weights['2B'] +
         data['3B'] * weights['3B'] +
         data['HR'] * weights['HR'] +
         data['BB'] * weights['BB'] +
         data['HBP'] * weights['HBP'] +
         data['SB'] * weights['SB'] +
         data['CS'] * weights['CS'])
    ) / (data['AB'] + data['BB'] - data['IBB'] + data['HBP'] + data['SF'])

    # 무한대 값 및 NaN 값 처리
    data['wOBA'].replace([float('inf'), -float('inf')], 0, inplace=True)
    data['wOBA'] = data['wOBA'].fillna(0)

    return data

def calculate_predictions(data):
    # 2024년 데이터 필터링
    data_2024 = data[data['year'] == 2024]

    # 예측 로직: 나이에 따라 wOBA 조정
    data_2025 = data_2024.copy()
    data_2025['year'] = 2025  # 연도 변경

    # 나이에 따른 wOBA 조정
    def adjust_wOBA(row):
        if 30 <= row['age'] <= 32:
            return row['wOBA'] * 1.05  # 5% 증가
        elif row['age'] < 30:
            return row['wOBA'] * 0.95  # 5% 감소
        elif row['age'] < 35:
            return row['wOBA'] * 0.85  # 15% 감소
        elif row['age'] > 25:
            return row['wOBA'] * 0.85  # 5% 감소
        else:
            return row['wOBA'] * 0.90  # 10% 감소

    data_2025['predicted_wOBA'] = data_2025.apply(adjust_wOBA, axis=1)

    # 기존 데이터에 예측 데이터 추가
    data = pd.concat([data, data_2025], ignore_index=True)

    return data

load_data("kbo_data/kbo_player_performance.csv")