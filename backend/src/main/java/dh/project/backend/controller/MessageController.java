package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.message.PostMessageRequestDto;
import dh.project.backend.dto.response.message.GetMessageResponseDto;
import dh.project.backend.dto.response.message.PostMessageResponseDto;
import dh.project.backend.service.MessageService;
import dh.project.backend.service.principal.user.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal PrincipalDetails user,
            @RequestParam Long receiverId
    ) {
        ApiResponseDto<PostMessageResponseDto> responseDto = messageService.sendMessage(dto, user.getUserId(), receiverId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 메시지 조회
     * */
    @GetMapping("/{receiverId}")
    public ResponseEntity<ApiResponseDto<List<GetMessageResponseDto>>> getMessages(
            @AuthenticationPrincipal PrincipalDetails user,
            @PathVariable("receiverId") Long receiverId
    ) {
        ApiResponseDto<List<GetMessageResponseDto>> responseDto = messageService.getMessages(user.getUserId(), receiverId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
