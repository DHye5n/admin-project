import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { AUTH_PATH, MAIN_PATH } from '../../constant';

export default function OAuth2() {
  const [cookie, setCookie] = useCookies();
  const { accessToken, expirationTime } = useParams();
  const navigator = useNavigate();

  console.log('accessToken', accessToken);
  console.log('expirationTime', expirationTime);

  useEffect(() => {

    if (!accessToken || !expirationTime) {
      // 에러 처리 또는 로그인 페이지로 리다이렉트
      navigator(AUTH_PATH());
      return;
    }

    const now = new Date().getTime();
    const expires = new Date(now + Number(expirationTime) * 1000);

    setCookie('accessToken', accessToken, { expires, path: '/' });

      navigator(MAIN_PATH());

    console.log('OAuth2 컴포넌트 실행됨');
    console.log('MAIN_PATH():', MAIN_PATH());

  }, [accessToken, expirationTime, navigator]);

  return <div>OAuth2 컴포넌트 실행됨</div>;
}