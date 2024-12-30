import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlayerStats.css';  // CSS 파일을 따로 만들어서 스타일링

const PlayerStats = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [playerInfo, setPlayerInfo] = useState(null);
    const [plotUrl, setPlotUrl] = useState('');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('https://your-api-gateway-url/players');
                setPlayers(response.data);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, []);

    const handlePlayerChange = async (event) => {
        const playerName = event.target.value;
        setSelectedPlayer(playerName);

        try {
            const response = await axios.get(`https://your-api-gateway-url/player/${playerName}`);
            setPlayerInfo(response.data);
            setPlotUrl(response.data.plotUrl);  // plotUrl이 포함되어 있다고 가정
        } catch (error) {
            console.error('Error fetching player info:', error);
        }
    };

    return (
        <div className="container">
            <h1>선수 스탯 시각화</h1>
            <form>
                <label htmlFor="player">선수 선택:</label>
                <select name="player" id="player" onChange={handlePlayerChange}>
                    <option value="">선수를 선택하세요</option>
                    {players.map(player => (
                        <option key={player.id} value={player.name}>{player.name} ({player.team})</option>
                    ))}
                </select>
            </form>
            {playerInfo && (
                <>
                    <h2>{selectedPlayer}의 2024년 데이터</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>나이</th>
                                <th>팀</th>
                                <th>타율</th>
                                <th>출루율</th>
                                <th>장타율</th>
                                <th>wOBA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{playerInfo.age}</td>
                                <td>{playerInfo.team}</td>
                                <td>{playerInfo.batting_avg}</td>
                                <td>{playerInfo.onbase_perc}</td>
                                <td>{playerInfo.slugging_perc}</td>
                                <td>{playerInfo.wOBA}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            {plotUrl && (
                <>
                    <h2>선수 스탯 그래프</h2>
                    <img src={plotUrl} alt="선수 스탯 그래프" />
                </>
            )}
        </div>
    );
};

export default PlayerStats; 