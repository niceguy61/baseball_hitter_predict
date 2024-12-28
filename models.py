import pandas as pd

def load_data(file_path):
    data = pd.read_csv(file_path)
    data.fillna(0, inplace=True)
    
    # wOBA 계산
    data = calculate_woba(data)
    
    # 예측 데이터 생성
    data = calculate_predictions(data)
    
    return data

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
