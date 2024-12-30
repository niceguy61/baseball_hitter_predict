import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Grid, Card, CardContent, Typography, TextField, Autocomplete, CardMedia } from '@mui/material';
import ReactEcharts from 'echarts-for-react';
import themes from './themes';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './App.css';
import pitcherPlaceholder from './assets/pitcher_black.png';
import batterPlaceholder from './assets/batter_black.png';

function App() {
  const [players, setPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [chartData, setChartData] = useState({});
  const [selectedMetrics, setSelectedMetrics] = useState([]);

  const batterHeaders = [
    "Year", "Team", "Age", "Pos.", "oWAR", "dWAR", "G", "PA", "ePA", "AB",
    "R", "H", "2B", "3B", "HR", "TB", "RBI", "SB", "CS", "BB", "HP", "IB",
    "SO", "GDP", "SH", "SF", "AVG", "OBP", "SLG", "OPS", "R/ePA", "wRC+", "WAR"
  ];

  const getPlaceholderImage = (position) => {
    return position === 'P' ? pitcherPlaceholder : batterPlaceholder;
  };

  useEffect(() => {
    setLoading(true);
    fetch('https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetBaseballPlayerList', {
        method: 'GET',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('선수 목록 불러오기 실패:', error);
        setLoading(false);
      });
  }, []);

  const handlePlayerSelect = (event, value) => {
    setSelectedPlayer(value?.id || '');
    if (value) {
      setPlayerLoading(true);
      fetch(`https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetPlayerInfo/${value.id}`, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(info => {
          setPlayerInfo(info);
          info.image_url = info.image_url || getPlaceholderImage(info.position);
          const detailUrl = info.position === 'P'
            ? `https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetPitcherDetail/${value.id}`
            : `https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetBatterDetail/${value.id}`;
          fetch(detailUrl, {
            method: 'GET',
            mode: 'cors'
          })
          .then(response => response.json())
          .then(data => {
            const filteredData = data.filter(stat => stat.Team !== '통산');
            setPlayerStats(filteredData);
            setPlayerLoading(false);
          })
          .catch(error => {
            console.error('선수 성적 불러오기 실패:', error);
            setPlayerLoading(false);
          });
        })
        .catch(error => {
          console.error('선수 정보 불러오기 실패:', error);
          setPlayerLoading(false);
        });
    }
  };

  const handleMetricChange = (event, value) => {
    setSelectedMetrics(value);
    const filteredStats = playerStats.filter(stat => stat.Year !== '통산');
    const labels = filteredStats.map(stat => stat.Year);

    const series = value.map(metric => ({
      name: metric,
      type: 'line',
      smooth: true,
      data: filteredStats.map(stat => Number(stat[metric]) || 0),
    }));

    setChartData({
      tooltip: {
        trigger: 'axis', // 마우스를 올렸을 때 툴팁 표시
        formatter: function (params) {
          let tooltipText = `Year: ${params[0].name}<br>`; // 연도 정보
          params.forEach((item) => {
            tooltipText += `${item.seriesName}: ${item.value}<br>`; // 지표와 값
          });
          return tooltipText;
        },
      },
      xAxis: {
        type: 'category',
        data: labels,
      },
      yAxis: {
        type: 'value',
      },
      series: series,
    });
  };

  return (
    <ThemeProvider theme={themes()}>
      <CssBaseline />
      <Container>
        <div className="header">
          <Typography variant="h3" gutterBottom>
            야구 선수 정보
          </Typography>
        </div>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">선수를 선택하세요:</Typography>
              <Autocomplete
                options={players}
                getOptionLabel={(option) => `${option.name} (${option.team})`}
                onChange={handlePlayerSelect}
                renderInput={(params) => <TextField {...params} label="선수 검색" fullWidth />}
              />
            </Grid>

            {selectedPlayer && playerInfo && (
              <Grid item xs={12} md={12}>
                {playerLoading ? (
                  <CircularProgress />
                ) : (
                  <Card>
                    <CardMedia
                      component="img"
                      height="300"
                      image={playerInfo.image_url}
                      alt={playerInfo.name || 'Placeholder Image'}
                    />
                    <CardContent>
                      <Typography variant="h5">
                        {playerInfo.name || '선수 정보 없음'} ({playerInfo.team || '팀 정보 없음'})
                      </Typography>
                      <Typography>포지션: {playerInfo.position || '정보 없음'}</Typography>
                      <Typography>경력: {playerInfo.career || '정보 없음'}</Typography>
                      <Typography>드래프트 정보: {playerInfo.draft_info || '정보 없음'}</Typography>
                      <Typography>학교: {playerInfo.school || '정보 없음'}</Typography>
                      <Typography>타격/투구: {playerInfo.bats || '정보 없음'}</Typography>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="stats-table">
                          <thead>
                            <tr>
                              {batterHeaders.map((header, idx) => (
                                <th key={idx}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {playerStats.map((stat, index) => (
                              <tr key={index}>
                                {batterHeaders.map((header, idx) => (
                                  <td key={idx}>{stat[header] || 'N/A'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Autocomplete
                        multiple
                        options={batterHeaders.filter(header => header !== 'Year')}
                        value={selectedMetrics}
                        onChange={handleMetricChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="지표 선택"
                            placeholder="지표를 검색하세요"
                          />
                        )}
                      />
                      {chartData.series && (
                        <ReactEcharts option={chartData} />
                      )}
                    </CardContent>
                  </Card>
                )}
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;