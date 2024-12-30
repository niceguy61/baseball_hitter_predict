import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    # DynamoDB 리소스 생성
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('kbo_pitcher_stat')

    # 이벤트에서 id를 가져옴
    id = event.get('pathParameters', {}).get('id')
    
    if id:
        # id를 기준으로 쿼리
        response = table.query(
            KeyConditionExpression=Key('id').eq(id)  # id가 batter_id와 같은 조건
        )
        
        # 결과가 없을 경우 처리
        if not response['Items']:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Pitcher not found'}, ensure_ascii=False)
            }
        
        # 첫 번째 아이템을 가져옴 (id가 유일하므로)
        batter_info = response['Items']

        # 결과 반환 (한글 인코딩 문제 해결)
        return {
            'statusCode': 200,
            'body': json.dumps(batter_info, ensure_ascii=False)  # 한글 인코딩 유지
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing id parameter'}, ensure_ascii=False)
        } 