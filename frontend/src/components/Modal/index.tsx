import './style.css';
import FindForm from '../FindForm';
import UpdateForm from '../UpdateForm';
import ListForm from '../ListForm';
import ReactDOM from 'react-dom';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'findPassword' | 'findUsername' | 'updatePassword' | 'followingList' | 'followerList';
}

export default function Modal({ isOpen, onClose, mode  }: Props) {

  const getFormComponent = () => {
    switch (mode) {
      case 'findPassword':
      case 'findUsername':
        return <FindForm mode={mode} onClose={onClose} />;
      case 'updatePassword':
        return <UpdateForm mode={mode} onClose={onClose} />;
      case 'followingList':
      case 'followerList':
        return <ListForm mode={mode} onClose={onClose} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div id='modal-card-wrapper'>
      <div className="modal-card-container">
        <div className='modal-card-content-box'>
          <div className="modal-content-body">
            {getFormComponent()}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}