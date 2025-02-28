import { Role } from '../enum';

export default interface UserListItem {
  userId: number;
  email: string;
  username: string;
  profileImage: string | null;
  followersCount: number;
  followingsCount: number;
  role: Role;
}