package dh.project.backend.exception;

import dh.project.backend.enums.ResponseStatus;
import lombok.Getter;

@Getter
public class ErrorException extends RuntimeException {

    private final ResponseStatus status;

    public ErrorException(ResponseStatus status) {
        super(status.getMessage());
        this.status = status;
    }

    public int getStatusCode() {
        return status.getStatus();
    }

}
