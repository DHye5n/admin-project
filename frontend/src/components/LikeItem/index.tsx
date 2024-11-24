import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {LikeListItem} from 'types/interface';


/**
 *  TODO: interface: Like List Item 컴포넌트 Properties
 * */
interface Props {
    likeListItem: LikeListItem;
}

/**
 *  TODO: component: Like List Item 컴포넌트
 * */
export default function LikeItem({ likeListItem }: Props) {

    /**
     *  TODO: state: properties
     * */
    const { profileImage, username } = likeListItem;

    /**
     *  TODO: render: Like List Item 렌더링
     * */
    return (
        <div className='like-list-item'>
            <div className='like-list-item-profile-box'>
                <div className='like-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
            </div>
            <div className='like-list-item-username'>{username}</div>

        </div>
    )
}