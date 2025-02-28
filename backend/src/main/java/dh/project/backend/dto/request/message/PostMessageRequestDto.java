package dh.project.backend.dto.request.message;

import dh.project.backend.domain.MessageEntity;
import dh.project.backend.domain.UserEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostMessageRequestDto {

    @NotBlank
    private String message;

    @Builder
    public PostMessageRequestDto(String message) {
        this.message = message;
    }

    // 엔티티 변환 메서드
    public MessageEntity toEntity(UserEntity sender, UserEntity receiver) {
        return MessageEntity.builder()
                .message(message)
                .sender(sender)
                .receiver(receiver)
                .build();
    }
}
