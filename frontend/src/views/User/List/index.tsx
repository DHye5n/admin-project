import Pagination from 'components/Pagination';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useEffect, useState } from 'react';
import { usePagination } from 'hooks';
import { BoardListItem, UserListItem } from 'types/interface';
import { getAllUserListRequest } from 'apis';
import { useCookies } from 'react-cookie';
import { ApiResponseDto } from 'apis/response';
import UserItem from 'components/UserItem';
import { GetAllUserListResponseDto } from 'apis/response/user';
import useSignInUserStore from 'stores/login-user.store';


/**
 *  TODO: component: Board Read 컴포넌트
 * */
export default function UserList() {
  /**
   *  TODO:  state: 상태
   * */
  const navigator = useNavigate();

  const [count, setCount] = useState<number>();

  const [cookie, setCookie] = useCookies();

  const { signInUser, setSignInUser } = useSignInUserStore();

  const [userList, setUserList] = useState<UserListItem[]>([]);

  /**
   *  TODO: function: 함수
   * */
  const checkLoginStatus = (accessToken: string | undefined) => {
    if (!accessToken) {
      navigator(AUTH_PATH());
      return false;
    }
    return true;
  };

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

  const {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    viewPageList,
    totalSection,
    setTotalList,
  } = usePagination<UserListItem>(5);

  /**
   *  TODO: function: 함수
   * */
  const getAllUserListResponse = (responseBody: ApiResponseDto<GetAllUserListResponseDto> | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { userList } = responseBody.data as GetAllUserListResponseDto;

    const userListFilter = userList.filter((user) => user.userId !== signInUser?.userId);

    setTotalList(userListFilter);
    setCount(userListFilter.length);
  };

  /**
   *  TODO: effect: 마운트 시 실행할 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    getAllUserListRequest(accessToken).then(getAllUserListResponse);
  }, []);

  /**
   *  TODO:  render: Board List 컴포넌트 렌더링
   * */
  return (
    <div id='user-list-wrapper'>
      <div className='user-list-container'>
        <div className='user-list-contents-box'>
          <div className='user-list-top-box'>
            <div className='user-list-title'>
              {'유저 목록'}
              <span className='list-divider'>|</span>
              <span className='list-emphasis'>
                 총 유저 {count}명
              </span>
            </div>
          </div>

          <div className='user-list-box'>
            {count === 0 ?
              <div className='user-list-contents-nothing'>{'가입한 유저가 없습니다.'}</div> :
              <div className='user-list-contents'>
                {viewList.map((userListItem) => (
                  <UserItem key={userListItem.userId} userListItem={userListItem} />
                ))}
              </div>
            }
          </div>
        </div>

        <div className="user-list-pagination-box">
          {count !== 0 &&
            <Pagination currentPage={currentPage} currentSection={currentSection}
                        setCurrentPage={setCurrentPage} setCurrentSection={setCurrentSection}
                        viewPageList={viewPageList} totalSection={totalSection} />
          }
        </div>

      </div>
    </div>
  );
}