import Stack from 'react-bootstrap/Stack';
import Pagination from 'react-bootstrap/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLimitSelect from './PageLimitSelect';
import PageSelector from './PageSelector';
import Loader from '../loaders/Loader';

function PaginationBar({ url, pageMeta, pageLinks, keepBackground }) {
  const location = useLocation();
  const background = location.state.backgroundLocation;
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
          () => {keepBackground ? 
                  navigate(`${url}?page=${pageNum}&limit=${pageMeta.limit}`,
                   { state : { backgroundLocation : background } }) :
                  navigate(`${url}?page=${pageNum}&limit=${pageMeta.limit}`)
                }
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
          <PageLimitSelect keepBackground={keepBackground}/>
          <PageSelector
            url={url}
            currentPage={currentPage}
            lastPage={lastPage}
            minPage={minPage}
            maxPage={maxPage}
            pageLinks={pageLinks}
            limit={pageMeta.limit}
            keepBackground={keepBackground}>
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
