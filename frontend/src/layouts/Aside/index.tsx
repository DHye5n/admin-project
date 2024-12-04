import React, { useState } from 'react';
import './style.css';
import { IonIcon } from '@ionic/react';
import {
  clipboardOutline,
  homeOutline,
  logoGithub,
  mailOutline, navigate,
  newspaperOutline,
  personOutline,
  settingsOutline,
} from 'ionicons/icons';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';


export default function Aside() {
  /**
   *   TODO:  state: 상태
   */
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  /**
   *  TODO:  function: navigate 함수
   * */
  const navigate = useNavigate();

  /**
   *   TODO:  item: 메뉴 아이템
   */
  const navItems = [
    { icon: homeOutline, title: "Dashboard" },
    { icon: clipboardOutline, title: "Board" },
    { icon: personOutline, title: "User" },
    { icon: settingsOutline, title: "Setting" },
  ];

  const handleOpenInNewTab = (url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); };

  const handleOpenMail = (email: string) => { window.location.href = `mailto:${email}`; };

  /**
   *  TODO:  event handler: 로고 클릭 이벤트 처리 함수
   * */
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };

  return (
    /**
     *   TODO:  render: Aside 컴포넌트 렌더링
     */
    <div id='aside'>
      <div className='aside-container'>
        <div className='aside-nav-top' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-light-icon'></div>
          </div>
          <div className='header-logo-title'>{'DHy25n'}</div>
        </div>

        <div className="aside-nav-middle">
          {navItems.map((item, index) => (
            <div key={index} className="aside-nav-links-box" onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(null)}>
              <IonIcon icon={item.icon}
                       style={{ width: "24px", height: "24px", color: hoverIndex === index ? "rgba(116, 148, 236, 1)" : "white", transition: "color 0.3s ease", }} />
              <span className="aside-nav-links-title"
                    style={{ color: hoverIndex === index ? "rgba(116, 148, 236, 1)" : "white", transition: "color 0.3s ease", }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="aside-nav-bottom">
          <div className="aside-nav-bottom-box">
            <div onClick={() => handleOpenMail('sai4875@naver.com')}>
              <IonIcon icon={mailOutline} style={{ width: '12px', height: '12px', color: 'white' }} />
              <span className="aside-nav-bottom-title">sai4875@naver.com</span>
            </div>
          </div>

          <div className="aside-nav-bottom-box">
            <div onClick={() => handleOpenInNewTab('https://github.com/DHye5n/admin-project')}>
              <IonIcon icon={logoGithub} style={{ width: '12px', height: '12px', color: 'white' }} />
              <span className='aside-nav-bottom-title'>github.com/DHye5n/admin-project</span>
            </div>
          </div>

          <div className='aside-nav-bottom-box'>
            <div onClick={() => handleOpenInNewTab('https://sai4875.tistory.com')}>
              <IonIcon icon={newspaperOutline} style={{ width: '12px', height: '12px', color: 'white' }} />
              <span className='aside-nav-bottom-title'>sai4875.tistory.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
