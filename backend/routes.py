from flask import Blueprint, render_template, request
from models import load_data, calculate_woba
import matplotlib.pyplot as plt
import os
import koreanize_matplotlib
import matplotlib

matplotlib.use('Agg')  # GUI 백엔드 대신 Agg 사용

main = Blueprint('main', __name__)

data = load_data('kbo_data/kbo_player_performance.csv')
data = calculate_woba(data)

@main.route('/')
def index():
    # 2024년 데이터가 있는 선수만 필터링
    players_with_data = data[data['year'] == 2024][['player_name', 'team']].drop_duplicates()

    selected_player = request.args.get('player', None)
    return render_template('index.html', 
                           players_with_data=players_with_data.to_dict(orient='records'), 
                           selected_player=selected_player)

@main.route('/plot', methods=['POST'])
def plot():
    selected_player = request.form.get('player')
    
    # 선수 이름과 팀을 분리하여 필터링
    try:
        player_name, team_name = selected_player.split(' (')
        team_name = team_name[:-1]  # 마지막 괄호 제거
    except ValueError:
        return "선수 선택 형식이 잘못되었습니다.", 400  # 잘못된 형식에 대한 에러 메시지

    player_data = data[(data['player_name'] == player_name) & (data['team'] == team_name)]

    if player_data.empty:
        return "선수의 데이터가 없습니다.", 404

    # 2024년 데이터 가져오기
    last_year_data = player_data[player_data['year'] == 2024]
    if last_year_data.empty:
        return "2024년 데이터가 없습니다.", 404

    # 선수의 2024년 데이터 추출
    player_info = last_year_data[['age', 'team', 'batting_avg', 'onbase_perc', 'slugging_perc', 'wOBA']].to_dict(orient='records')[0]

    # 그래프 생성
    fig, axs = plt.subplots(2, 2, figsize=(12, 10))

    # 첫 번째 차트: 타율, 출루율, 장타율, OPS
    axs[0, 0].plot(player_data['year'], player_data['batting_avg'], label='타율', marker='o')
    axs[0, 0].plot(player_data['year'], player_data['onbase_perc'], label='출루율', marker='o')
    axs[0, 0].plot(player_data['year'], player_data['slugging_perc'], label='장타율', marker='o')
    axs[0, 0].plot(player_data['year'], player_data['onbase_plus_slugging'], label='OPS', marker='o')
    axs[0, 0].set_title(f'{selected_player}의 타격 스탯')
    axs[0, 0].set_xlabel('연도')
    axs[0, 0].set_ylabel('스탯')
    axs[0, 0].legend()
    axs[0, 0].grid()

    # 두 번째 차트: wOBA
    axs[0, 1].plot(player_data['year'], player_data['wOBA'], label='wOBA', marker='x', color='purple')
    axs[0, 1].set_title(f'{selected_player}의 wOBA')
    axs[0, 1].set_xlabel('연도')
    axs[0, 1].set_ylabel('wOBA')
    axs[0, 1].legend()
    axs[0, 1].grid()

    # 세 번째 차트: 안타, 득점, 타점
    axs[1, 0].plot(player_data['year'], player_data['H'], label='안타', marker='s', color='brown')
    axs[1, 0].plot(player_data['year'], player_data['R'], label='득점', marker='^', color='green')
    axs[1, 0].plot(player_data['year'], player_data['RBI'], label='타점', marker='d', color='orange')
    axs[1, 0].set_title(f'{selected_player}의 안타, 득점, 타점')
    axs[1, 0].set_xlabel('연도')
    axs[1, 0].set_ylabel('수치')
    axs[1, 0].legend()
    axs[1, 0].grid()

    # 빈 차트
    axs[1, 1].axis('off')

    plt.tight_layout()

    # 그래프 저장
    plot_path = os.path.join('static', 'plot.png')
    plt.savefig(plot_path)
    plt.close()

    return render_template('index.html', 
                           players_teams=data[['player_name', 'team']].drop_duplicates().to_dict(orient='records'), 
                           plot_url=plot_path, 
                           selected_player=selected_player,
                           player_info=player_info)
