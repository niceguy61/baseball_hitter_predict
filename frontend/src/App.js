import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Grid, Card, CardContent, Typography, Select, MenuItem, CardMedia } from '@mui/material';
import themes from './themes';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './App.css';
import pitcherPlaceholder from './assets/images/users/pitcher_black.png';
import batterPlaceholder from './assets/images/users/batter_black.png';

function App() {
  const [players, setPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);
  const batterHeaders = [
    "Year", "Team", "Age", "Pos.", "oWAR", "dWAR", "G", "PA", "ePA", "AB",
    "R", "H", "2B", "3B", "HR", "TB", "RBI", "SB", "CS", "BB", "HP", "IB",
    "SO", "GDP", "SH", "SF", "AVG", "OBP", "SLG", "OPS", "R/ePA", "wRC+", "WAR"
  ];
  const pitcherHeaders = [
    "Year", "Team", "Age", "Pos.", "G", "GS", "GR", "GF", "CG", "SHO",
    "W", "L", "S", "HD", "IP", "ER", "R", "rRA", "TBF", "H", "2B", "3B",
    "HR", "BB", "HP", "IB", "SO", "ROE", "BK", "WP", "ERA", "RA9", "rRA9",
    "FIP", "WHIP", "WAR"
  ];

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

  const handlePlayerSelect = (playerId) => {
    setSelectedPlayer(playerId);
    setPlayerLoading(true);
    fetch(`https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetPlayerInfo/${playerId}`, {
        method: 'GET',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(info => {
        setPlayerInfo(info);
        const detailUrl = info.position === 'P'
          ? `https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetPitcherDetail/${playerId}`
          : `https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetBatterDetail/${playerId}`;
        fetch(detailUrl, {
          method: 'GET',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
          setPlayerStats(data);
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
  };

  const getPlaceholderImage = (position) => {
    return position === 'P' ? pitcherPlaceholder : batterPlaceholder;
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
              <Select
                fullWidth
                value={selectedPlayer}
                onChange={(e) => handlePlayerSelect(e.target.value)}
              >
                <MenuItem value="">--선택--</MenuItem>
                {players.map(player => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name} ({player.team})
                  </MenuItem>
                ))}
              </Select>
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
                      image={playerInfo.image_url || getPlaceholderImage(playerInfo.position)}
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
                              {(playerInfo.position === 'P' ? pitcherHeaders : batterHeaders).map((header, idx) => (
                                <th key={idx}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {playerStats.map((stat, index) => (
                              <tr key={index}>
                                {(playerInfo.position === 'P' ? pitcherHeaders : batterHeaders).map((header, idx) => (
                                  <td key={idx}>{stat[header] || 'N/A'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
