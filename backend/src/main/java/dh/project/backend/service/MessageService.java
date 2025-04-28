package dh.project.backend.service;

import dh.project.backend.domain.MessageEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.message.PostMessageRequestDto;
import dh.project.backend.dto.response.message.GetMessageResponseDto;
import dh.project.backend.dto.response.message.PostMessageResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.handler.MessageHandler;
import dh.project.backend.repository.MessageRepository;
import dh.project.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MessageService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final MessageHandler messageHandler;

    /**
     *   TODO: 메시지 작성
     * */
    @Transactional
    public ApiResponseDto<PostMessageResponseDto> sendMessage(
            PostMessageRequestDto requestDto, Long senderId, Long receiverId) {

        UserEntity sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        UserEntity receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        if ((requestDto.getMessage() == null || requestDto.getMessage().trim().isEmpty())) {
            throw new ErrorException(ResponseStatus.NOT_EMPTY);
        }

        MessageEntity messageEntity = requestDto.toEntity(sender, receiver);

        MessageEntity savedMessage = messageRepository.save(messageEntity);

        PostMessageResponseDto responseDto = PostMessageResponseDto.fromEntity(savedMessage);

        messageHandler.sendMessageToUser(receiverId, savedMessage.getMessage());

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 메시지 조회
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<List<GetMessageResponseDto>> getMessages(Long senderId, Long receiverId) {

        List<MessageEntity> messages = messageRepository.getMessagesBetweenUsers(senderId, receiverId);

        List<GetMessageResponseDto> responseDto = GetMessageResponseDto.fromEntityList(messages);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

}
