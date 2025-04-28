package dh.project.backend.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class MessageHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessageToUser(Long receiverId, String message) {
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, message);
    }
}
