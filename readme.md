# KBO Player Stats Visualization ⚾️

이 프로젝트는 KBO 선수의 성적을 시각화하고 분석하는 Flask 애플리케이션입니다. 선수의 다양한 통계 데이터를 기반으로 wOBA(Weighted On-Base Average)를 계산하고, 이를 그래프로 표현합니다. 야구 팬들이 쉽게 이해할 수 있도록 구성되어 있습니다!

## 📦 설치 방법

1. **Python 설치**: 이 프로젝트는 Python 3.x 버전에서 실행됩니다. [Python 다운로드](https://www.python.org/downloads/) 페이지에서 설치하세요.

2. **필요한 라이브러리 설치**:
   ```bash
   pip install flask pandas matplotlib scikit-learn koreanize-matplotlib
   ```

3. **CSV 데이터 준비**: KBO 선수 성적 데이터 CSV 파일을 준비해야 합니다. 이 파일은 [Kaggle에서 다운로드](https://www.kaggle.com/datasets/clementmsika/kbo-player-performance-dataset-2018-2024)할 수 있습니다. 다운로드한 파일을 `kbo_data/kbo_player_performance.csv` 경로에 저장하세요.

## 🚀 사용 방법

1. **애플리케이션 실행**:
   ```bash
   python app.py
   ```

2. **웹 브라우저 열기**: 웹 브라우저에서 `http://127.0.0.1:5000` 주소로 이동합니다.

3. **선수 선택**: 드롭다운 메뉴에서 원하는 선수를 선택하고 "제출" 버튼을 클릭합니다. 🏆

4. **그래프 확인**: 선택한 선수의 타격 통계와 wOBA 그래프가 표시됩니다. 각 그래프 아래에는 해당 지표에 대한 설명이 있습니다. 📊

## 📈 주요 기능

- **wOBA 계산**: 선수의 출루 방식에 따라 가중치를 부여하여 wOBA를 계산합니다. ⚾️
- **다양한 통계 시각화**: 타율, 출루율, 장타율, OPS 등 다양한 통계를 그래프로 시각화합니다. 📉
- **선수 데이터 필터링**: 2024년도에 데이터가 있는 선수만 필터링하여 분석합니다. 🔍

## 🎉 기여하기

이 프로젝트에 기여하고 싶으신 분은 언제든지 Pull Request를 보내주세요! 여러분의 아이디어와 개선 사항을 환영합니다. 🤝

## 📜 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

---

야구는 팀워크와 전략이 중요한 스포츠입니다! 이 애플리케이션을 통해 KBO 선수들의 성적을 분석하고, 더 나아가 야구에 대한 이해를 높여보세요! ⚾️✨