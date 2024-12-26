import './style.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useBoardStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import useSignInUserStore from '../../../stores/login-user.store';
import { getBoardRequest } from '../../../apis';
import { ApiResponseDto } from '../../../apis/response';
import { GetBoardResponseDto } from '../../../apis/response/board';
import { convertUrlsToFile } from '../../../utils';

/**
 *  TODO: component: BoardUpdate 컴포넌트
 * */
export default function BoardUpdate() {
  /**
   *  TODO:  state: 요소 참조 상태
   * */
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  /**
   *  TODO:  state: 게시물 상태
   * */
  const { boardId } = useParams();
  const { signInUser } = useSignInUserStore();
  const { title, setTitle } = useBoardStore();
  const { content, setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList } = useBoardStore();

  const [cookie, setCookie] = useCookies();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

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

  /**
   *  TODO:  function: 네비게이트 함수
   * */
  const navigator = useNavigate();

  const getBoardResponse = (responseBody: ApiResponseDto<GetBoardResponseDto> | null) => {
    if (!responseBody) {
      navigator(MAIN_PATH());
      return;
    }

    const { code } = responseBody;
    if (code !== 'SU') {
      handleApiError(code);
      return;
    }

    const { title, content, boardImageList, email } = responseBody.data as GetBoardResponseDto;

    setTitle(title);
    setContent(content);
    setImageUrls(boardImageList);
    convertUrlsToFile(boardImageList).then(boardImageFileList => setBoardImageFileList(boardImageFileList));

    if (!signInUser) {
      navigator(AUTH_PATH());
      return;
    }

    if (signInUser.email !== email) {
      navigator(MAIN_PATH());
      return;
    }
  }

  /**
   *  TODO:  event handler: 변경 이벤트 처리
   * */
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTitle(value);

    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }

  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);

    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }

  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return;

    const files = Array.from(event.target.files);

    // 미리보기
    const newImageUrls = [...files.map(file => URL.createObjectURL(file)), ...imageUrls];
    setImageUrls(newImageUrls);
    // 업로드
    const newBoardImageList = [...files, ...boardImageFileList];
    setBoardImageFileList(newBoardImageList);

    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }
  
  /**
   *  TODO:  event handler: 버튼 클릭 이벤트 처리
   * */
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  }

  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImageFileList.filter((filter, index) => index !== deleteIndex);
    setBoardImageFileList(newBoardImageFileList);
  }

  /**
   *  TODO:  effect: 마운트 시 실행할 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!checkLoginStatus(accessToken)) return;

    if (!boardId) return;

    getBoardRequest(boardId, accessToken).then(getBoardResponse);
  }, [boardId]);

  /**
   *  TODO:  render: BoardUpdate 컴포넌트 렌더링
   * */
  return (
    <div id='board-update-wrapper'>
      <div className='board-update-container'>
        <div className='board-update-box'>
          <div className='board-update-title-box'>
            <textarea ref={titleRef} className='board-update-title-textarea' placeholder='제목을 작성해주세요.'
                   value={title} onChange={onTitleChangeHandler} rows={1} />
          </div>

          <div className='divider'></div>

          <div className='board-update-content-box'>
            <textarea ref={contentRef} className='board-update-content-textarea' placeholder='본문을 작성해주세요.'
                      value={content} onChange={onContentChangeHandler} />
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' multiple accept='image/*' style={{ display: 'none' }}
                   onChange={onImageChangeHandler}/>
          </div>

          <div className='board-update-images-box'>
            {imageUrls && Array.isArray(imageUrls) && imageUrls.map((imageUrl, index) =>
              <div className='board-update-image-box' key={imageUrl}>
                <img className='board-update-image'
                     src={imageUrl} alt={`image-${index}`} />
                <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                  <div className='icon close-icon'></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
