import Stack from 'react-bootstrap/Stack';
import Pagination from 'react-bootstrap/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputSelect from './InputSelect';

function PaginationBar({ url, pageMeta, pageLinks }) {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = pageMeta.page;
  const lastPage = pageMeta.total_pages;
  const minPage = currentPage - 2 > 2 ? currentPage - 2 : 2;
  const maxPage = currentPage + 2 < lastPage ? currentPage + 2 : lastPage - 1;
  const firstPage = 1;

  function handleLimitChange(event) {
    let limit = event.target.value;
    if (limit) {
      setSearchParams({ limit });
    } else {
      setSearchParams({});
    }
  };

  let betweenPages = [];
  for (let pageNum = minPage; pageNum <= maxPage; pageNum++) {
    betweenPages.push(
      <Pagination.Item 
        key={pageNum} 
        onClick={
          () => navigate(`${url}?page=${pageNum}&limit=${pageMeta.limit}`)
        }
        active={pageNum === currentPage}
      >
        {pageNum}
      </Pagination.Item>
    )
  };

  return (
    <>
      <div>
        <Stack gap={3} direction="horizontal">
          <InputSelect
            name="PageLimit"
            label="Results per Page"
            defaultValue={searchParams.limit}
            changeHandler={handleLimitChange}
          >
            <option hidden>{pageMeta.limit}</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </InputSelect>
        <Pagination size="sm">
          <>
            {
              pageLinks.prev !== null  &&
                <Pagination.Prev onClick={() => navigate(pageLinks.prev)} />
            }
          </>
          <Pagination.Item 
            key={firstPage} 
            onClick={
              () => navigate(`${url}?page=${firstPage}&limit=${pageMeta.limit}`)}
            active={firstPage === currentPage}>
            {firstPage}
          </Pagination.Item>
          {
            minPage > firstPage + 1 &&
              <Pagination.Ellipsis />
          }
          <>
            {betweenPages}
          </>
          {
            maxPage < lastPage - 1 &&
              <Pagination.Ellipsis />
          }
          <Pagination.Item 
            key={lastPage} 
            onClick={
              () => navigate(`${url}?page=${lastPage}&limit=${pageMeta.limit}`)}
            active={lastPage === currentPage}>
            {lastPage}
          </Pagination.Item>
          <>
            {
              pageLinks.next !== null && 
                <Pagination.Next onClick={() => navigate(pageLinks.next)} />
            }
          </>
        </Pagination>
        </Stack>
      </div>
    </>
  );
}

export default PaginationBar;
