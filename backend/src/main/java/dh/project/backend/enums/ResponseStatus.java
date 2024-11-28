package dh.project.backend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseStatus {

    SUCCESS(200,"SU", "Success"),
    VALIDATION_FAILED(422,"VF", "Validation Failed."),
    DUPLICATE_EMAIL(409,"DE", "Duplication Email."),
    DUPLICATE_USERNAME(409,"DU", "Duplication Username."),
    PASSWORD_MISMATCH(400, "PM", "Password does not match."),
    DUPLICATE_PHONE(409,"DP", "Duplication Phone."),
    NOT_EXISTED_USER(404,"NEU", "This user does not exist."),
    NOT_EXISTED_BOARD(404,"NEB", "This board does not exist."),
    SIGN_IN_FAIL(401,"SF", "Login information mismatch."),
    AUTHORIZATION_FAIL(401,"AF", "Authorization Failed."),
    NO_PERMISSION(403,"NP", "Do not have permission."),
    DATABASE_ERROR(500,"DBE", "Database Error."),
    JWT_ERROR(401,"JE", "JWT Error.");

    private final int status;
    private final String code;
    private final String message;
}
