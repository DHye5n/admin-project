export default interface SignUpRequestDto {
  email: string;
  // verificationCode: string;
  password: string;
  passwordCheck: string;
  username: string;
  phone: string;
  zonecode: string;
  address: string;
  addressDetail: string;
  agreedPersonal: boolean;
}
