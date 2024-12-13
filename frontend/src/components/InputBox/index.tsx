import React, {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
} from 'react';
import './style.css';
import {
  eyeOffOutline,
  eyeOutline,
  homeOutline,
  mailOutline,
  personOutline,
  shieldCheckmark, shieldCheckmarkOutline,
  shieldOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

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
  icon?: 'expand-right-light-icon' | 'eyeOff' | 'eyeOn' | 'email' | 'home' | 'person' | 'shield' |
    'emailError' | 'emailSuccess' | 'shieldError' | 'shieldSuccess' | 'personError' | 'personSuccess';
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

  const iconMapping: Record<string, { icon: string, color: string }> = {
    eyeOff: { icon: eyeOffOutline, color: 'rgba(0, 0, 0, 0.7)' },
    eyeOn: { icon: eyeOutline, color: 'rgba(0, 0, 0, 0.7)' },
    email: { icon: mailOutline, color: 'rgba(0, 0, 0, 0.7)' },
    emailError: { icon: mailOutline, color: 'rgba(255, 0, 0, 0.7)' },
    emailSuccess: { icon: mailOutline, color: 'rgba(0, 128, 0, 0.7)' },
    home: { icon: homeOutline, color: 'rgba(128, 0, 128, 0.7)' },
    person: { icon: personOutline, color: 'rgba(0, 0, 0, 0.7)' },
    personError: { icon: personOutline, color: 'rgba(255, 0, 0, 0.7)' },
    personSuccess: { icon: personOutline, color: 'rgba(0, 128, 0, 0.7)' },
    shield: { icon: shieldOutline, color: 'rgba(0, 0, 0, 0.7)' },
    shieldError: { icon: shieldCheckmarkOutline, color: 'rgba(255, 0, 0, 0.7)' },
    shieldSuccess: { icon: shieldCheckmarkOutline, color: 'rgba(0, 128, 0, 0.7)' }
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
        <input ref={ref} type={type} className='input'
          placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDownHandler}
        />
        {onButtonClick !== undefined && icon && (
          <div className='icon-button' onClick={onButtonClick}>
            <IonIcon
              icon={iconMapping[icon]?.icon}
              className="ion-icon"
              style={{ color: iconMapping[icon]?.color }}
            />
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
