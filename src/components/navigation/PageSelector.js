import Pagination from 'react-bootstrap/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';

function PageSelector({ url, currentPage, lastPage, minPage, maxPage, pageLinks, limit, children, keepBackground }) {
  const location = useLocation();
  const background = location.state.backgroundLocation;
  const navigate = useNavigate();
  const firstPage = 1;

  return (
    <>
      <div>
        <Pagination size="sm" className="PageSelector">
          <>
            {
              pageLinks.prev !== null  &&
                <Pagination.Prev onClick={
                  () => {keepBackground ? 
                    navigate(pageLinks.prev, { state : { backgroundLocation : background } }) :
                    navigate(pageLinks.prev) 
                  }
                } />
            }
          </>
          <Pagination.Item 
            key={firstPage} 
            onClick={
              () => {keepBackground ? 
                    navigate(`${url}?page=${firstPage}&limit=${limit}`,
                             { state : { backgroundLocation : background } }) :
                    navigate(`${url}?page=${firstPage}&limit=${limit}`)
                  }
            }
            active={firstPage === currentPage}>
            {firstPage}
          </Pagination.Item>
          {
            minPage > firstPage + 1 &&
              <Pagination.Ellipsis />
          }
          <>
            {children}
          </>
          {
            maxPage < lastPage - 1 &&
              <Pagination.Ellipsis />
          }
          <>
            {lastPage !== firstPage &&
          <Pagination.Item 
            key={lastPage} 
            onClick={
              () => {keepBackground ? 
                    navigate(`${url}?page=${lastPage}&limit=${limit}`,
                             { state : { backgroundLocation : background } }) :
                    navigate(`${url}?page=${lastPage}&limit=${limit}`)
                  }
            }
            active={lastPage === currentPage}>
            {lastPage}
          </Pagination.Item>
            }
          </>
          <>
            {
              pageLinks.next !== null && 
                <Pagination.Next onClick={
                () => {keepBackground ? 
                    navigate(pageLinks.next, { state : { backgroundLocation : background } }) :
                    navigate(pageLinks.next) 
                }} />
            }
          </>
        </Pagination>
      </div>
    </>
  );
}

export default PageSelector;
