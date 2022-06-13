const Score = ({player, opponent} : {player : number, opponent : number}) => {
    return (
      <div className="score">
        <div id="player-score">{player}</div>
        <div id="opponent-score">{opponent}</div>
      </div>
    );
};

export default Score;