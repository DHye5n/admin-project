import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import {LikeListItem} from 'types/interface';

interface Props {
    likeListItem: LikeListItem;
}
// component: Like List Item 컴포넌트 //
export default function LikeItem({ likeListItem }: Props) {

// properties //
const { profileImage, username } = likeListItem;

// render: Like List Item 렌더링 //
    return (
        <div className='like-list-item'>
            <div className='like-list-item-profile-box'>
                <div className='like-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
            </div>
            <div className='like-list-item-username'>{username}</div>
            
        </div>
    )
}