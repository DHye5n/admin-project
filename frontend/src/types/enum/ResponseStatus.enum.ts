enum ResponseStatus {
  SUCCESS = 'SU',
  VALIDATION_FAILED = 'VF',
  DUPLICATE_EMAIL = 'DE',
  DUPLICATE_USERNAME = 'DU',
  DUPLICATE_PHONE = 'DP',
  NOT_EXISTED_USER = 'NEU',
  NOT_EXISTED_BOARD = 'NEB',
  SIGN_IN_FAIL = 'SF',
  AUTHORIZATION_FAIL = 'AF',
  NO_PERMISSION = 'NP',
  DATABASE_ERROR = 'DBE',
  JWT_ERROR = 'JE',
  INVALID_EMAIL = 'IE',
  EXPIRED_VERIFICATION_CODE = 'EVC',
  INCORRECT_VERIFICATION_CODE = 'IVC'
}

export default ResponseStatus;
