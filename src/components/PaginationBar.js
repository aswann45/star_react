import Stack from 'react-bootstrap/Stack';
import Pagination from 'react-bootstrap/Pagination';
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import PageLimitSelect from './PageLimitSelect';
import PageSelector from './PageSelector';
import Loader from './Loader';

function PaginationBar({ url, pageMeta, pageLinks }) {

  const navigate = useNavigate();
  const currentPage = pageMeta.page;
  const lastPage = pageMeta.total_pages;
  const minPage = currentPage - 2 > 2 ? currentPage - 2 : 2;
  const maxPage = currentPage + 2 < lastPage ? currentPage + 2 : lastPage - 1;

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
      {pageLinks ?
        <Stack direction="horizontal" gap={2} className="PaginationBar">
          <PageLimitSelect />
          <PageSelector
            url={url}
            currentPage={currentPage}
            lastPage={lastPage}
            minPage={minPage}
            maxPage={maxPage}
            pageLinks={pageLinks}
            limit={pageMeta.limit}>
            {betweenPages}
          </PageSelector>
        </Stack>
        :
        <Loader object={pageLinks} />
        }
      </>
  );
}

export default PaginationBar;
