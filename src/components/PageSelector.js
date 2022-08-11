import Pagination from 'react-bootstrap/Pagination';
import { useNavigate } from 'react-router-dom';

function PageSelector({ url, currentPage, lastPage, minPage, maxPage, pageLinks, limit, children }) {

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
                  () => navigate(pageLinks.prev)} />
            }
          </>
          <Pagination.Item 
            key={firstPage} 
            onClick={
              () => navigate(`${url}?page=${firstPage}&limit=${limit}`)}
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
              () => navigate(`${url}?page=${lastPage}&limit=${limit}`)}
            active={lastPage === currentPage}>
            {lastPage}
          </Pagination.Item>
            }
          </>
          <>
            {
              pageLinks.next !== null && 
                <Pagination.Next onClick={
                  () => navigate(pageLinks.next)} />
            }
          </>
        </Pagination>
      </div>
    </>
  );
}

export default PageSelector;
