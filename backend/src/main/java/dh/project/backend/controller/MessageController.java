package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.message.PostMessageRequestDto;
import dh.project.backend.dto.response.message.GetMessageResponseDto;
import dh.project.backend.dto.response.message.PostMessageResponseDto;
import dh.project.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
@RestController
public class MessageController {

    private final MessageService messageService;

    /**
     *   TODO: 메시지 작성
     * */
    @PostMapping("/send")
    public ResponseEntity<ApiResponseDto<PostMessageResponseDto>> sendMessage(
            @RequestBody PostMessageRequestDto dto,
            @RequestParam Long senderId,
            @RequestParam Long receiverId
    ) {
        ApiResponseDto<PostMessageResponseDto> responseDto = messageService.sendMessage(dto, senderId, receiverId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 메시지 조회
     * */
    @GetMapping("/{senderId}/{receiverId}")
    public ResponseEntity<ApiResponseDto<List<GetMessageResponseDto>>> getMessages(
            @PathVariable("senderId") Long senderId,
            @PathVariable("receiverId") Long receiverId
    ) {
        ApiResponseDto<List<GetMessageResponseDto>> responseDto = messageService.getMessages(senderId, receiverId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
