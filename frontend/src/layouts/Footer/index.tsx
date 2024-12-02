import './style.css';

/**
 *  TODO: component: Footer 레이아웃 컴포넌트
 * */
export default function Footer() {
  /**
   *  TODO: event handler: email icon 클릭 이벤트 처리 함수
   * */
  const onEmailIconButtonClickHandler = () => {
    window.location.href = 'mailto:sai4875@naver.com';
  };

  /**
   *  TODO: event handler: github icon 클릭 이벤트 처리 함수
   * */
  const onGithubIconButtonClickHandler = () => {
    window.open('https://github.com/DHye5n/admin-project');
  };
  /**
   *  TODO: event handler: blog icon 클릭 이벤트 처리 함수
   * */
  const onBlogIconButtonClickHandler = () => {
    window.open('https://sai4875.tistory.com/');
  };

  /**
   *  TODO:  render: Footer 레이아웃 컴포넌트 렌더링
   * */
  return (
    <div id='footer'>
      <div className='footer-container'>
        <div className='footer-top'>
          <div className='footer-logo-box'>
            <div className='footer-link-item'>
              <div className='icon-box'>
                <div className='icon logo-light-icon'></div>
              </div>
              <div className='footer-logo-text'>{'DHy25n Project'}</div>
            </div>
            <div className='footer-copyright'>
              {'Copyright ⓒ 2024 DHy25n. All Rights Reserved.'}
            </div>
          </div>

          <div className='footer-link-box'>
            <div className='footer-link-item'>
              <div
                className='icon-button'
                onClick={onEmailIconButtonClickHandler}
              >
                <div className='icon email-white-icon'></div>
              </div>
              <div className='footer-logo-link-text'>{'sai4875@naver.com'}</div>
            </div>

            <div className='footer-link-item'>
              <div
                className='icon-button'
                onClick={onGithubIconButtonClickHandler}
              >
                <div className='icon github-icon'></div>
              </div>
              <div className='footer-logo-link-text'>
                {'github.com/DHye5n/admin-project'}
              </div>
            </div>

            <div className='footer-link-item'>
              <div
                className='icon-button'
                onClick={onBlogIconButtonClickHandler}
              >
                <div className='icon blog-icon'></div>
              </div>
              <div className='footer-logo-link-text'>
                {'sai4875.tistory.com'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
