import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useSearchParams, useLocation } from 'react-router-dom';

function PageLimitSelect({ keepBackground }) {
  const [searchParams, setSearchParams] = useSearchParams();
  let location = useLocation();
  const background = location.state.backgroundLocation

  function handleSelect(event_key) {
    let newLimit = event_key;
    if (newLimit) {
      if (keepBackground) {
        setSearchParams({
          ...searchParams,
          limit: newLimit
        }, {
          state : { backgroundLocation : background }
        });
      } else {
        setSearchParams({
          ...searchParams,
          limit: newLimit
        }); 
      } 
    } else {
      setSearchParams({
        ...searchParams
      })
    }
    //setItemLimit(newLimit)
    //}
  };

  return(
    <>
      <DropdownButton 
        id="page-limit-select" 
        title={`# Items per Page`}
        className="PageLimitSelect"
        size="sm"
        variant="secondary"
        onSelect={handleSelect}>
        <Dropdown.Item eventKey={10}>10 per page</Dropdown.Item>
        <Dropdown.Item eventKey={25}>25 per page</Dropdown.Item>
        <Dropdown.Item eventKey={50}>50 per page</Dropdown.Item>
        <Dropdown.Item eventKey={100}>100 per page</Dropdown.Item>
      </DropdownButton>
    </>
  );
}

export default PageLimitSelect;
