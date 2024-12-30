# lambda_function.py
import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    # DynamoDB 리소스 생성
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('kbo_player')

    # 전체 선수 호출 (여기서 id를 기준으로 쿼리)
    id = event.get('id')  # 이벤트에서 player_id를 가져옴
    if id:
        response = table.query(
            KeyConditionExpression=Key('id').eq(id)  # id가 player_id와 같은 조건
        )
    else:
        # player_id가 없을 경우 전체 선수 호출 (scan 사용)
        response = table.scan()

    # label, team, player_name 값만 추출
    players_info = [
        {
            'id': item['id'],
            'team': item['team'],
            'name': item['name']
        }
        for item in response['Items']
        if 'id' in item and 'team' in item and 'name' in item
    ]

    # 결과 반환 (한글 인코딩 문제 해결)
    return {
        'statusCode': 200,
        'body': json.dumps(players_info, ensure_ascii=False)  # 한글 인코딩 유지
    }