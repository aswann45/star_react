import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useSearchParams } from 'react-router-dom';

function PageLimitSelect() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSelect(event_key) {
    let newLimit = event_key;
    if (newLimit) {
      setSearchParams({
        ...searchParams,
        limit: newLimit
      });
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
