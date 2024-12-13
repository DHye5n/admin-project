package dh.project.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseStatus {
    // SUCCESS: 200
    SUCCESS(200,"SU", "Success"),

    // INVALID: 400
    INVALID_EMAIL(400, "IE", "Invalid email address."),
    INVALID_FILE_NAME(400, "IFN","Invalid file name"),
    INCORRECT_VERIFICATION_CODE(400, "IVC", "Incorrect verification code."),
    EXPIRED_VERIFICATION_CODE(400, "EVC", "Verification code has expired."),
    INVALID_FILE_EXTENSION(400, "IFE", "Invalid file extension."),
    FILE_EMPTY(400, "FE", "File is empty."),
    PASSWORD_MISMATCH(400, "PM", "Password does not match."),

    // Authorization: 401
    SIGN_IN_FAIL(401,"SF", "Login information mismatch."),
    AUTHORIZATION_FAIL(401,"AF", "Authorization Failed."),
    JWT_ERROR(401,"JE", "JWT Error."),

    NO_PERMISSION(403,"NP", "Do not have permission."),

    // NOT_FOUND: 404
    NOT_FOUND_USER(404, "NFU", "User Not Found."),
    NOT_EXISTED_USER(404,"NEU", "This user does not exist."),
    NOT_EXISTED_BOARD(404,"NEB", "This board does not exist."),
    NOT_FOUND_FILE(404, "NFF", "File not found."),
    NOT_FOUND_BOARD(404, "NFB", "Board not found."),

    // DUPLICATE: 409
    DUPLICATE_EMAIL(409,"DE", "Duplication Email."),
    DUPLICATE_USERNAME(409,"DU", "Duplication Username."),
    DUPLICATE_PHONE(409,"DP", "Duplication Phone."),

    VALIDATION_FAILED(422,"VF", "Validation Failed."),

    // SERVER ERROR: 500
    FILE_UPLOAD_FAIL(500, "FF","File upload failed"),
    FILE_READ_FAIL(500, "FRF", "File read failed."),
    DATABASE_ERROR(500,"DBE", "Database Error.");



    private final int status;
    private final String code;
    private final String message;
}
