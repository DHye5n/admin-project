package dh.project.backend.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Async
    public void sendVerificationEmail(String to, String verificationCode) {
        String subject = "인증코드 발송 안내";
        String content = "<p>안녕하세요,</p>"
                + "<p>회원가입을 위한 인증코드는 다음과 같습니다:</p>"
                + "<h2 style='color:green;'>" + verificationCode + "</h2>"
                + "<p>해당 인증코드를 입력하여 가입을 완료해 주세요.</p>"
                + "<p>감사합니다.</p>";

        sendEmail(to, subject, content, true); // ✅ HTML 이메일
    }

    @Async
    public void sendTemporaryPassword(String to, String tempPassword) {
        String subject = "임시 비밀번호 발급 안내";
        String content = "<p>안녕하세요,</p>"
                + "<p>요청하신 임시 비밀번호는 다음과 같습니다:</p>"
                + "<h2 style='color:red;'>" + tempPassword + "</h2>"
                + "<p><strong>로그인 후 반드시 비밀번호를 변경해 주세요.</strong></p>"
                + "<p>감사합니다.</p>";

        sendEmail(to, subject, content, true); // ✅ HTML 이메일
    }

    @Async
    public void sendUsername(String to, String username) {
        String subject = "아이디 찾기 안내";
        String content = "<p>안녕하세요,</p>"
                + "<p>요청하신 계정의 아이디는 다음과 같습니다:</p>"
                + "<h2 style='color:blue;'>" + username + "</h2>"
                + "<p>로그인 페이지에서 해당 아이디를 사용하여 로그인하세요.</p>"
                + "<p>감사합니다.</p>";

        sendEmail(to, subject, content, true); // ✅ HTML 이메일
    }

    /**
     * 공통 이메일 전송 메서드
     * @param to 받는 사람 이메일
     * @param subject 이메일 제목
     * @param content 이메일 내용 (HTML 형식)
     * @param isHtml HTML 여부 (true: HTML, false: 일반 텍스트)
     */
    private void sendEmail(String to, String subject, String content, boolean isHtml) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("sai4875@naver.com");
            helper.setText(content, isHtml); // ✅ HTML 사용

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }

}
