import { differenceInHours, differenceInMinutes, differenceInSeconds, format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string): string {
  const currentDate = new Date(date);
  const currentTime = new Date();

  // 현재 시간에서 경과된 시간 계산
  const secondsAgo = differenceInSeconds(currentTime, currentDate);
  const minutesAgo = differenceInMinutes(currentTime, currentDate);
  const hoursAgo = differenceInHours(currentTime, currentDate);

  // 1분 미만이면 초 단위로 표시
  if (secondsAgo < 60) {
    return `${secondsAgo}초 전`;
  }

  // 1시간 미만이면 분 단위로 표시
  if (minutesAgo < 60) {
    return `${minutesAgo}분 전`;
  }

  // 1시간 이상이면 시간 단위로 표시
  if (hoursAgo < 24) {
    return `${hoursAgo}시간 전`;
  }

  // 24시간 이상이면 날짜 형식으로 표시
  return `${currentDate.getFullYear()}.${currentDate.getMonth() + 1}.${currentDate.getDate()}`;
}