const UserProfile = ({ user }) => {
  return (
    <div>
      <h1>{user.username}</h1>
      <h2>Level {user.level}</h2>
      <p>Ranking: {user.ranking}</p>
      <p>Games won: {user.games_won}</p>
      <p>Games lost: {user.games_lost}</p>
      <button>Invite to play</button>
      <button>Add to friend</button>
    </div>
  );
};

export default UserProfile;
