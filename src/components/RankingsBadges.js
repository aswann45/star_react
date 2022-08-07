import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

function RankingBadge({ type, rank }) {

  return(
    <Button className="RankingBadge">
      {type}
      <br />
      Priority #{rank}
    </Button>
  );
}

function RankingsBadges({ request }) {

  return (
    <>
    <Stack direction="horizontal" className="RankingBadges">
      <>
        {request.Top10 === true &&
          <RankingBadge 
          type="Top 10" 
          rank={request.Top10Ranking} 
          className="Top10Badge"/>
        }
      </>
      <>
      <RankingBadge 
      type={request.Subcommittee} 
      rank={request.PriorityRanking} 
      className="SubRankingBadge"/>
      </>
    </Stack>
    </>
  );
}

export default RankingsBadges;
