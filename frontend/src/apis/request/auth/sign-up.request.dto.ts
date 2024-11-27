export default interface SignUpRequestDto {
    email: string;
    password: string;
    passwordCheck: string;
    username: string;
    phone: string;
    address: string;
    zonecode: string;
    addressDetail: string;
    agreedPersonal: boolean;
}