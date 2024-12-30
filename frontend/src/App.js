import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Grid, Card, CardContent, Typography, Select, MenuItem, CardMedia } from '@mui/material';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);

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
    fetch(`https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetBatterDetail/${playerId}`, {
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

    fetch(`https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetPlayerInfo/${playerId}`, {
        method: 'GET',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data => {
        setPlayerInfo(data);
      })
      .catch(error => console.error('선수 정보 불러오기 실패:', error));
  };

  return (
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
                    height="200"
                    image={playerInfo.image_url}
                    alt={playerInfo.name}
                  />
                  <CardContent>
                    <Typography variant="h5">
                      {playerInfo.name} ({playerInfo.team})
                    </Typography>
                    <Typography variant="body1">
                      포지션: {playerInfo.position}
                    </Typography>
                    <Typography variant="body2">
                      경력: {playerInfo.career}
                    </Typography>
                    <Typography variant="body2">
                      드래프트 정보: {playerInfo.draft_info}
                    </Typography>
                    <table className="stats-table">
                      <thead>
                        <tr>
                          <th>연도</th>
                          <th>타율(AVG)</th>
                          <th>홈런(HR)</th>
                          <th>타점(RBI)</th>
                          <th>OPS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerStats.map((stat, index) => (
                          <tr key={index}>
                            <td>{stat.Year}</td>
                            <td>{stat.AVG}</td>
                            <td>{stat.HR}</td>
                            <td>{stat.RBI}</td>
                            <td>{stat.OPS}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default App;
