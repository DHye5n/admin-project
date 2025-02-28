package dh.project.backend.dto.response.message;

import dh.project.backend.domain.MessageEntity;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import lombok.Builder;
import lombok.Getter;

@Getter
public class PostMessageResponseDto {

    private final String message;
    private final SignInUserResponseDto sender;
    private final String createdDate;


    @Builder
    public PostMessageResponseDto(String message, SignInUserResponseDto sender ,String createdDate) {
        this.message = message;
        this.sender = sender;
        this.createdDate = createdDate;
    }

    public static PostMessageResponseDto fromEntity(MessageEntity directMessage) {
        SignInUserResponseDto senderDto = SignInUserResponseDto.fromEntity(directMessage.getSender());

        return PostMessageResponseDto.builder()
                .message(directMessage.getMessage())
                .sender(senderDto)
                .createdDate(directMessage.getCreatedDate())
                .build();
    }
}
