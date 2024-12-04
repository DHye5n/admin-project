import Header from 'layouts/Header';
import { Outlet, useLocation } from 'react-router-dom';
import { AUTH_PATH } from 'constant';
import Aside from 'layouts/Aside';
import Content from 'layouts/Content';

/**
 *  TODO: component: 레이아웃
 * */
export default function Container() {
  /**
   *  TODO:  state: 현재 페이지 path name 상태
   * */
  const { pathname } = useLocation();

  /**
   *  TODO:  render: 레이아웃 렌더링
   * */
  return (
    <div id='dashboard-layout'>
      {pathname !== AUTH_PATH() && <Aside />}
      <div className='dashboard-main'>
        {pathname !== AUTH_PATH() && <Header />}
        {pathname !== AUTH_PATH() && <Content />}
        {/*<Outlet />*/}
      </div>
    </div>
  );
}
