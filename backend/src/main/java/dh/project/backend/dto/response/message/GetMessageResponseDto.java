package dh.project.backend.dto.response.message;

import dh.project.backend.domain.MessageEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetMessageResponseDto {

    private final String message;
    private final String username;
    private final String profileImage;
    private final String createdDate;

    @Builder
    public GetMessageResponseDto(MessageEntity messageEntity) {
        this.message = messageEntity.getMessage();
        this.username = messageEntity.getSender().getUsername();
        this.profileImage = messageEntity.getSender().getProfileImage();
        this.createdDate = messageEntity.getCreatedDate().toString();
    }

    // 리스트 변환만 제공
    public static List<GetMessageResponseDto> fromEntityList(List<MessageEntity> messageEntities) {
        return messageEntities.stream()
                .map(GetMessageResponseDto::new) // 생성자 이용
                .collect(Collectors.toList());
    }
}
