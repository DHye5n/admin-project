import {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
} from 'react';
import './style.css';

/**
 *   TODO:   interface: Input Box 컴포넌트 Properties
 * */
interface Props {
  label: string;
  type: 'text' | 'password';
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon' |
    'email-gray-icon' | 'email-check-icon' | 'home-gray-icon' | 'auth-icon';
  onButtonClick?: () => void;
  message?: string;
  successMessage?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 *  TODO:  component: Input Box 컴포넌트
 * */
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  /**
   *  TODO:  state: properties
   * */
  const { label, type, placeholder, value, error, icon, message, successMessage } = props;
  const { onChange, onButtonClick, onKeyDown } = props;


  /**
   *  TODO:  event handler: input 키 이벤트 처리 함수
   * */
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!onKeyDown) return;
    onKeyDown(event);
  };

  /**
   *  TODO:  render: Input Box 컴포넌트 렌더링
   * */
  return (
    <div className='inputbox'>
      <div className='inputbox-label'>{label}</div>

      <div
        className={error ? 'inputbox-container-error' : successMessage ? 'inputbox-container-success' : 'inputbox-container'}
      >
        <input
          ref={ref}
          type={type}
          className='input'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDownHandler}
        />
        {onButtonClick !== undefined && (
          <div className='icon-button' onClick={onButtonClick}>
            {icon !== undefined && <div className={`icon ${icon}`}></div>}
          </div>
        )}
      </div>

      {message !== undefined && (
        <div className={error ? 'inputbox-message-error' : 'inputbox-message-success'}>
          {error ? message : successMessage}
        </div>
      )}

    </div>
  );
});

export default InputBox;
