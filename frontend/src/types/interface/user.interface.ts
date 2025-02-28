import { Role } from '../enum';


export default interface User {
  userId: number;
  email: string;
  username: string;
  profileImage: string | null;
  phone: string;
  followersCount: number;
  followingsCount: number;
  following: boolean;
  role: Role;
}
