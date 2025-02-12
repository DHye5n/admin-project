import './style.css';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useBoardStore } from 'stores';
import { useNavigate } from 'react-router-dom';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { PostBoardResponseDto } from 'apis/response/board';
import useSignInUserStore from 'stores/login-user.store';
import { ApiResponseDto } from 'apis/response';
import { fileUploadRequest, postBoardRequest } from 'apis';
import { PostBoardRequestDto } from 'apis/request/board';

/**
 *  TODO: component: BoardWrite 컴포넌트
 * */
export default function BoardWrite() {
  /**
   *  TODO:  state: 요소 참조 상태
   * */
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);


  /**
   *  TODO:  state: 게시물 상태
   * */
  const { title, setTitle } = useBoardStore();
  const { content, setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList } = useBoardStore();
  const { resetBoard } = useBoardStore();

  const [cookie, setCookie] = useCookies();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { signInUser } = useSignInUserStore();


  /**
   *  TODO:  function: 네비게이트 함수
   * */
  const navigator = useNavigate();

  /**
   *  TODO:  event handler: 변경 이벤트 처리
   * */
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTitle(value);

    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  };

  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);

    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };

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
  };
  
  /**
   *  TODO:  event handler: 버튼 클릭 이벤트 처리
   * */
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImageFileList.filter((filter, index) => index !== deleteIndex);
    setBoardImageFileList(newBoardImageFileList);
  };

  /**
   *  TODO: component: 업로드 버튼 컴포넌트
   * */
  const UploadButton = () => {
    /**
     *  TODO: state: 게시물 상태
     * */
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();

    /**
     *  TODO: function: board post response 처리 함수
     * */
    const postBoardResponse = (responseBody: PostBoardResponseDto | ApiResponseDto<PostBoardResponseDto> | null) => {
      if (!responseBody) return;

      const { code } = responseBody;

      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'AF' || code === 'NFU') navigator(AUTH_PATH());
      if (code === 'VF') alert('제목과 내용은 필수입니다.');
      if (code !== 'SU') return;

      resetBoard();

      if (!signInUser) return;
      navigator(MAIN_PATH());
    };

    /**
     *  TODO: event handler: 업로드 버튼 클릭 이벤트 처리 함수
     * */
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookie.accessToken;
      if (!accessToken) return;

      if (!title || title.trim() === "") {
        alert('제목은 필수 입력사항입니다.');
        return;
      }

      if (!content || content.trim() === "") {
        alert('내용은 필수 입력사항입니다.');
        return;
      }

      if (boardImageFileList.length === 0) {
        alert('이미지는 필수 입력사항입니다.');
        return;
      }

      const boardImageList: string[] = [];

      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append('file', file);

        const url = await fileUploadRequest(data, accessToken);

        if (url && url.data) {
          console.log("URL successfully uploaded:", url.data);
          boardImageList.push(url.data);
        } else {
          console.log("No URL data in the response.");
        }
      }
      const requestBody: PostBoardRequestDto = {
        title, content, boardImageList
      };

      postBoardRequest(requestBody, accessToken).then(postBoardResponse);
    };

    /**
     *  TODO: render: 업로드 버튼 컴포넌트 렌더링
     * */
    if (title && content && boardImageFileList.length > 0)
      return (
        <div className='blue-button' onClick={onUploadButtonClickHandler}>
          {'업로드'}
        </div>
      );

    /**
     *  TODO: render: 업로드 불가 버튼 컴포넌트 렌더링
     * */
    return <div className='disable-button'>{'업로드'}</div>;
  };

  /**
   *  TODO:  effect: 마운트 시 실행할 함수
   * */
  useEffect(() => {
    const accessToken = cookie.accessToken;
    if (!accessToken) {
      navigator(MAIN_PATH());
      return;
    }
    resetBoard();
  }, []);

  /**
   *  TODO:  render: BoardWrite 컴포넌트 렌더링
   * */
  return (
    <div id='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>
          <div className='board-write-upload-box'>
          <UploadButton />
          </div>
          <div className='board-write-title-box'>
            <textarea ref={titleRef} className='board-write-title-textarea' placeholder='제목을 작성해주세요.'
                      value={title} onChange={onTitleChangeHandler} rows={1} />
          </div>
          <div className='divider'></div>

          <div className='board-write-content-box'>
            <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해주세요.'
                      value={content} onChange={onContentChangeHandler} />
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' multiple accept='image/*' style={{ display: 'none' }}
                   onChange={onImageChangeHandler} />
          </div>

          <div className='board-write-images-box'>
            {imageUrls.map((imageUrl, index) =>
              <div className='board-write-image-box' key={imageUrl}>
                <img className='board-write-image'
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
