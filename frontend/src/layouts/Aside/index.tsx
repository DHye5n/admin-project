import React, { useEffect, useState } from 'react';
import './style.css';
import { IonIcon } from '@ionic/react';
import {
  clipboardOutline,
  homeOutline, keyOutline,
  logoGithub, logOutOutline,
  mailOutline,
  newspaperOutline,
  personOutline,
  settingsOutline,
} from 'ionicons/icons';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import useSignInUserStore from 'stores/login-user.store';
import { useCookies } from 'react-cookie';
import Modal from 'components/Modal';


export default function Aside() {
  /**
   *   TODO:  state: 상태
   */
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { signInUser, setSignInUser, resetSignInUser } = useSignInUserStore();

  const [cookie, setCookie] = useCookies();

  const [isSignIn, setSignIn] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] = useState<'updatePassword'>('updatePassword');

  const openModal = (type: 'updatePassword') => {
    setMode(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  /**
   *  TODO:  function: navigate 함수
   * */
  const navigator = useNavigate();

  /**
   *   TODO:  item: 메뉴 아이템
   */
  const navItems = [
    { icon: homeOutline, title: "Dashboard", path: "/dashboard" },
    { icon: clipboardOutline, title: "Board", path: "/boards/list" },
    { icon: personOutline, title: "User", path: "/users/list" },
    // { icon: settingsOutline, title: "Setting", path: "/settings" },
  ];

  const handleOpenInNewTab = (url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); };

  const handleOpenMail = (email: string) => { window.location.href = `mailto:${email}`; };

  /**
   *  TODO:  event handler: 로고 클릭 이벤트 처리 함수
   * */
  const onLogoClickHandler = () => {
    navigator(MAIN_PATH());
  };

  const onSignOutButtonClickHandler = () => {
    resetSignInUser();
    setCookie('accessToken', '', { path: '/', expires: new Date(0) });
    navigator(AUTH_PATH());

  };

  useEffect(() => {
    if (cookie.accessToken) {
      setSignIn(true);
    } else {
      setSignIn(false);
    }
  }, [cookie, isModalOpen]);


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
            <div key={index} className="aside-nav-links-box" onMouseEnter={() => setHoverIndex(index)}
                 onMouseLeave={() => setHoverIndex(null)} onClick={() => navigator(item.path)}>
              <IonIcon icon={item.icon}
                       style={{
                         width: "24px",
                         height: "24px",
                         color: hoverIndex === index ? "rgba(116, 148, 236, 1)" : "white",
                         transition: "color 0.3s ease",
                       }} />
              <span className="aside-nav-links-title"
                    style={{
                      color: hoverIndex === index ? "rgba(116, 148, 236, 1)" : "white",
                      transition: "color 0.3s ease",
                    }}>
                {item.title}
              </span>
            </div>
          ))}
          {isSignIn && (
            <div className="aside-nav-links-box" onMouseEnter={() => setHoverIndex(navItems.length)}
                 onMouseLeave={() => setHoverIndex(null)} onClick={onSignOutButtonClickHandler}>
              <IonIcon icon={logOutOutline}
                       style={{
                         width: "24px",
                         height: "24px",
                         color: hoverIndex === navItems.length ? "rgba(116, 148, 236, 1)" : "white",
                         transition: "color 0.3s ease",
                       }} />
              <span className="aside-nav-links-title"
                    style={{
                      color: hoverIndex === navItems.length ? "rgba(116, 148, 236, 1)" : "white",
                      transition: "color 0.3s ease",
                    }}>
                Logout
              </span>
            </div>
          )}
        </div>

        {isModalOpen && <Modal isOpen={isModalOpen} mode={mode} onClose={closeModal} />}

        <div className="aside-nav-bottom">
          <div className="aside-nav-bottom-box" onClick={() => openModal('updatePassword')}>
            <div>
              <IonIcon icon={keyOutline} style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <span className="aside-nav-bottom-title">비밀번호 변경</span>
          </div>

          <div className="aside-nav-bottom-box" onClick={() => handleOpenMail('sai4875@naver.com')}>
            <div>
              <IonIcon icon={mailOutline} style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <span className="aside-nav-bottom-title">sai4875@naver.com</span>
          </div>

          <div className="aside-nav-bottom-box"
               onClick={() => handleOpenInNewTab('https://github.com/DHye5n/admin-project')}>
            <div>
              <IonIcon icon={logoGithub} style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <span className="aside-nav-bottom-title">github.com/DHye5n/admin-project</span>
          </div>

          <div className="aside-nav-bottom-box" onClick={() => handleOpenInNewTab('https://sai4875.tistory.com')}>
            <div>
              <IonIcon icon={newspaperOutline} style={{ width: '12px', height: '12px', color: 'white' }} />
            </div>
            <span className='aside-nav-bottom-title'>sai4875.tistory.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
