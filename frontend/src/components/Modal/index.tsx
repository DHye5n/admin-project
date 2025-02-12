import './style.css';
import React, { useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import FindForm from '../FindForm';
import UpdateForm from '../UpdateForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'findPassword' | 'findUsername' | 'updatePassword';
}

export default function Modal({ isOpen, onClose, mode  }: Props) {

  if (!isOpen) return null;

  const getTitle = () => {
    switch(mode) {
      case 'findPassword':
        return '비밀번호 찾기';
      case 'findUsername':
        return '아이디 찾기';
      case 'updatePassword':
        return '비밀번호 변경';
      default:
        return '기타';
    }
  };

  const getFormComponent = () => {
    switch (mode) {
      case 'findPassword':
      case 'findUsername':
        return <FindForm mode={mode} />;
      case 'updatePassword':
        return <UpdateForm mode={mode} />;
      default:
        return null;
    }
  };

  return (
    <div id='modal-card-wrapper'>
      <div className="modal-card-container">
        <div className='modal-card-content-box'>
          <div className='modal-content-top'>
            <div className='modal-content-subject'>{getTitle()}</div>
            <div className="modal-close-button" onClick={onClose}>
              <IonIcon icon={closeOutline} style={{ color: 'black', width: '24px', height: '24px' }} />
            </div>
          </div>
          <div className="modal-content-body">
            {getFormComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}