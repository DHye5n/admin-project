enum ResponseStatus {
  SUCCESS = 'SU',
  VALIDATION_FAILED = 'VF',
  DUPLICATE_EMAIL = 'DE',
  DUPLICATE_USERNAME = 'DU',
  DUPLICATE_PHONE = 'DP',
  NOT_FOUND_USER = 'NFU',
  NOT_EXISTED_USER = 'NEU',
  NOT_EXISTED_BOARD = 'NEB',
  SIGN_IN_FAIL = 'SF',
  AUTHORIZATION_FAIL = 'AF',
  NO_PERMISSION = 'NP',
  DATABASE_ERROR = 'DBE',
  JWT_ERROR = 'JE',
  INVALID_EMAIL = 'IE',
  EXPIRED_VERIFICATION_CODE = 'EVC',
  INCORRECT_VERIFICATION_CODE = 'IVC',
  FILE_EMPTY = 'FE',
  FILE_UPLOAD_FAIL = 'FF',
  INVALID_FILE_NAME = 'IFN',
  NOT_FOUNT_FILE = 'NFF',
  FILE_READ_FAIL = 'FRF',
  INVALID_FILE_EXTENSION = 'IFE',
  NOT_FOUND_BOARD = 'NFB',
  NOT_FOUND_BOARD_USER = 'NFBU',
  NOT_EMPTY = 'NE'
}

export default ResponseStatus;
