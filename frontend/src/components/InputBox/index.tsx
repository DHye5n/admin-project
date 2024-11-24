import {ChangeEvent, Dispatch, KeyboardEvent, forwardRef, SetStateAction} from "react";
import './style.css';

/**
 *   TODO:   interface: Input Box 컴포넌트 Properties
 * */
interface Props {
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    error: boolean;
    icon?: string;
    onButtonClick?: () => void;
    message?: string;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

    /**
     *  TODO:  component: Input Box 컴포넌트
     * */
    const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    /**
     *  TODO:  state: properties
     * */
    const { label, type, placeholder, value, error, icon, message } = props;
    const { setValue, onButtonClick, onKeyDown } = props;

    /**
     *  TODO:  event handler: input 값 변경 이벤트 처리 함수
     * */
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(value);
    };

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

            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value}
                       onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
                {onButtonClick !== undefined && (
                    <div className='icon-button'>
                        {icon !== undefined && (<div className={`icon ${icon}`}></div>)}
                    </div>
                )}
            </div>

            {message !== undefined && <div className='inputbox-message'>{message}</div>}

        </div>
    )
});

export default InputBox;