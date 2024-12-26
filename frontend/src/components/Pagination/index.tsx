import './style.css';
import { Dispatch, SetStateAction } from 'react';

/**
 *  TODO: interface: Pagination 컴포넌트 Properties
 * */
interface Props {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentSection: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  viewPageList: number[];
  totalSection: number;
}

/**
 *  TODO: component: Pagination 컴포넌트
 * */
export default function Pagination(props: Props) {
  /**
   *  TODO: state: Properties
   * */
  const { currentPage, currentSection, viewPageList, totalSection } = props;
  const { setCurrentPage, setCurrentSection } = props;

  /**
   *  TODO: event handler: 클릭 이벤트
   * */
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  };

  const onPrevClickHandler = () => {
    if (currentSection === 1) return;
    setCurrentPage((currentSection - 1) * 10);
    setCurrentSection(currentSection - 1);
  };

  const onNextClickHandler = () => {
    if (currentSection === totalSection) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurrentSection(currentSection + 1);
  };


  /**
   *  TODO: render: Pagination 렌더링
   * */
  return (
    <div id='pagination-wrapper'>
      <div className='pagination-change-link-box'>
        <div className='icon-box-small'>
          <div className='icon expand-left-icon'></div>
        </div>
        <div className='pagination-change-link-text' onClick={onPrevClickHandler}>{'이전'}</div>
      </div>
      <div className='pagination-divider'>{'\|'}</div>

      {viewPageList.map(page => page === currentPage ?
        (<div key={page} className="pagination-text-active">{page}</div>) :
        (<div key={page} className="pagination-text" onClick={() => onPageClickHandler(page)}>{page}</div>)
      )}

      <div className='pagination-divider'>{'\|'}</div>
      <div className="pagination-change-link-box">
        <div className='pagination-change-link-text' onClick={onNextClickHandler}>{'다음'}</div>
        <div className="icon-box-small">
          <div className="icon expand-right-icon"></div>
        </div>
      </div>
    </div>
  )
}