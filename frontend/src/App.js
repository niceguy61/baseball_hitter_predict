import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  // 선수 목록 불러오기
  useEffect(() => {
    fetch('https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetBaseballPlayerList')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('선수 목록 불러오기 실패:', error));
  }, []);

  // 선수 선택 시 상세 데이터 불러오기
  const handlePlayerSelect = (playerId) => {
    setSelectedPlayer(playerId);
    fetch(`https://a342y8dz2i.execute-api.ap-northeast-2.amazonaws.com/prod/GetBatterDetail/${playerId}`)
      .then(response => response.json())
      .then(data => setPlayerStats(data))
      .catch(error => console.error('선수 성적 불러오기 실패:', error));
  };

  return (
    <div className="App">
      <div className="header">
        <h1>야구 선수 정보</h1>
      </div>

      <div className="content">
        <label>선수를 선택하세요: </label>
        <select
          onChange={(e) => handlePlayerSelect(e.target.value)}
          value={selectedPlayer}
        >
          <option value="">--선택--</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.team})
            </option>
          ))}
        </select>

        {selectedPlayer && (
          <div className="player-card">
            <h2>
              {players.find(p => p.id === selectedPlayer)?.name}
            </h2>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
