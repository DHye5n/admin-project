import './style.css';
import { UserListItem } from 'types/interface';
import React, { useEffect, useState } from 'react';
import useSignInUserStore from 'stores/login-user.store';
import { usePagination } from 'hooks';
import { ApiResponseDto } from 'apis/response';
import { GetFollowingListResponseDto } from 'apis/response/user';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import { getFollowerListRequest, getFollowingListRequest } from 'apis';
import UserItem from '../UserItem';
import Pagination from '../Pagination';
import { GetFollowerListResponseDto } from 'apis/response/user';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

function ListForm({ mode, onClose }: { mode: 'followingList' | 'followerList'; onClose: () => void }) {
  /**
   *  TODO: state: 상태
   * */
  const [userList, setUserList] = useState<UserListItem[]>([]);

  const [count, setCount] = useState<number>(2);

  const { signInUser, setSignInUser } = useSignInUserStore();

  const [cookie, setCookie] = useCookies();

  const { userId } = useParams();

  /**
   *  TODO: function: 함수
   * */
  const navigator = useNavigate();

  const handleApiError = (code: string) => {
    switch (code) {
      case 'NFB':
        alert('존재하지 않는 게시물입니다.');
        navigator(MAIN_PATH());
        break;
      case 'DBE':
        alert('데이터베이스 오류입니다.');
        navigator(AUTH_PATH());
        break;
      case 'VF':
        alert('잘못된 접근입니다.');
        navigator(MAIN_PATH());
        break;
      case 'NFU':
        alert('존재하지 않는 유저입니다.');
        navigator(MAIN_PATH());
        break;
      case 'AF':
        alert('인증에 실패했습니다.');
        navigator(AUTH_PATH());
        break;
      case 'NP':
        alert('권한이 없습니다.');
        navigator(MAIN_PATH());
        break;
      default:
        navigator(MAIN_PATH());
    }
  };

  const checkLoginStatus = (accessToken: string | undefined) => {
    if (!accessToken) {
      navigator(AUTH_PATH());
      return false;
    }
    return true;
  };

  const {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    viewPageList,
    totalSection,
    setTotalList } = usePagination<UserListItem>(3);

  /**
   *  TODO: function: 함수
   * */
  const getFollowingListResponse = (responseBody: ApiResponseDto<GetFollowingListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { followingList } = responseBody.data as GetFollowingListResponseDto;

    setTotalList(followingList);
    setCount(followingList.length);
  };

  const getFollowerListResponse = (responseBody: ApiResponseDto<GetFollowerListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { followerList } = responseBody.data as GetFollowerListResponseDto;

    setTotalList(followerList);
    setCount(followerList.length);
  };


  /**
   *  TODO: effect: 마운트 시 실행될 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;
    if (!userId) return;

    // mode에 따라 팔로잉 리스트 또는 팔로워 리스트 가져오기
    if (mode === 'followingList') {
      getFollowingListRequest(userId, accessToken).then(getFollowingListResponse);
    } else {
      getFollowerListRequest(userId, accessToken).then(getFollowerListResponse);
    }
  }, [mode, userId]);


  return (
    <div className="modal-content-body-input-box">
      <div className='modal-content-top'>
        {mode === 'followingList' ? (
            <div className="modal-content-subject">팔로잉 리스트</div>
          ) :
          <div className="modal-content-subject">팔로우 리스트</div>
        }
        <div className="modal-close-button" onClick={onClose}>
          <IonIcon icon={closeOutline} style={{ color: 'black', width: '24px', height: '24px' }} />
        </div>
      </div>

      <div className="main-bottom-contents-box">
        <div className="main-bottom-latest-contents-box">
          {viewList.map((userListItem) => (
            <UserItem key={userListItem.userId} userListItem={userListItem} />
          ))}
        </div>

      </div>

      <div className="main-bottom-pagination-box">
        {count !== 0 &&
          <Pagination currentPage={currentPage} currentSection={currentSection}
                      setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                      viewPageList={viewPageList} totalSection={totalSection} />
        }
      </div>
    </div>
  );
}

export default ListForm;