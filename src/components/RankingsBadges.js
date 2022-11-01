import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';

import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Loader from './loaders/Loader';


function RankingOptions({
  options_count, request, field, priority, setPriority
}) {
  const current_number = priority

   let options = [];
    //const [compareNum, setCompareNum] = useState(current_number);
   for (let number = 1; number <= options_count; number++) {
     options.push(
       <Dropdown.Item key={number}
         active={
           number === current_number ? true : false
         }
         eventKey={number}
         onClick={() => {
           setPriority(number);
          }}
       >
         {number}
       </ Dropdown.Item>
     )
   };
  return (
    options
  );
};

function RankingBadge({
  type, request, options_count, variant, setPriority,
  priority, field, defaultValue
}) {
  let put_url;
    switch(field) {
      case 'Top10Ranking':
        put_url = '/requests/' + request.ID
        break;
      case 'ProjectPriority':
        put_url = '/project_details/' + request.ProjectID
        break;
      default:
        put_url = '/requests/' + request.ID
  };

  const api = useApi();
  useEffect(() => {
    if (priority && priority !== request[field]) {
    (async () => {
            const data = await api.put(put_url, null, {
        body: {
          [field] : priority,
          EditorID: localStorage.getItem('currentUserID'),
        }
      });
      if (!data.ok) {
        ;
      }
    })();
    }
  }, [priority, field, request, api, put_url]);

  return(
    <>
      <DropdownButton title={`${type} #${priority}`}
        className="RankingBadge" size="sm"
        variant={variant}
      >
        <RankingOptions options_count={options_count}
          priority={priority}
          field={field}
          request={request}
          setPriority={setPriority}/>
      </DropdownButton>
    </>
  );
}

function RankingsBadges({ url }) {
  // STATE VARIABLES
  // request object
  const [request, setRequest] = useState({});
  // priority numebrs
  const [priority, setPriority] = useState();
  const [top10Priority, setTop10Priority] = useState();
  const [projectPriority, setProjectPriority] = useState();

  // API call to get request data
  const api = useApi();
  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setRequest(response.ok ? response.body : null);
      // Clear the priority state when we load a new request
      setPriority();
      setTop10Priority();
      setProjectPriority();
    })();
  }, [api, url]);

  useEffect(() => {
    setTop10Priority(request.Top10Ranking);
    setPriority(request.PriorityRanking);
    setProjectPriority(request.ProjectPriority);
  }, [request]);

  return (
    <>
    {(request && request.length !== 0) ?
    <Stack direction="vertical" className="RankingBadges">
      <>
        {request.Top10 === true &&
        <>
          {top10Priority ?
          <RankingBadge
            type="Top 10"
            field="Top10Ranking"
            setPriority={setTop10Priority}
            priority={top10Priority}
            request={request}
            options_count={10}
            variant="warning"
            className="Top10Badge"
          />
          :
            top10Priority !== null ? 
              <Loader />
            : 'No data to display'
          }
        </>
        }
      </>
      <>
        {request.RequestType === 'Project' &&
        <>
          {projectPriority ?
          <RankingBadge
            type="CPF"
            field="ProjectPriority"
            setPriority={setProjectPriority}
            priority={projectPriority}
            request={request}
            options_count={15}
            variant="info"
            className="CPFBadge"
          />
          : projectPriority !== null ? 
          <Loader />
          : <p>No data to display</p>
          }
        </>
        }
      </>
      <>
      {priority ?
      <RankingBadge
        type={request.Subcommittee}
        field="PriorityRanking"
        setPriority={setPriority}
        priority={priority}
        request={request}
        options_count={75}
        className="SubRankingBadge"/>
        : priority != null ? 
        <Loader />
        : <p>No data to display</p>
      }
      </>
    </Stack>
    :
    <Loader object={request} />
    }
    </>
  );
}

export default RankingsBadges;
