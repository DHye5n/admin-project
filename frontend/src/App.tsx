import React from 'react';
import './App.css';
import {commentListMock, latestBoardListMock, likeListMock, top3BoardListMock} from 'mocks';
import Top3Item from './components/Top3Item';
import CommentItem from './components/CommentItem';
import LikeItem from "./components/LikeItem";

function App() {
  return (
    <>
        <div style={{ display: 'flex', columnGap: '30px', rowGap: '20px'}}>
            {likeListMock.map(likeListItem => <LikeItem likeListItem={likeListItem} />)}
        </div>
    </>
  );
}

export default App;
