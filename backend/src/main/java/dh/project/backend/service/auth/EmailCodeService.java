package dh.project.backend.service.auth;

import dh.project.backend.domain.EmailEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.EmailCodeRequestDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.EmailCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class EmailCodeService {

    private final EmailCodeRepository emailCodeRepository;
    private final EmailService emailService;
    private static final int CODE_LENGTH = 4;

    /**
     *   TODO: 인증 코드 생성
     * */
    public String generateVerificationCode() {

        Random random = new Random();

        int code = random.nextInt((int) Math.pow(10, CODE_LENGTH));

        return String.format("%0" + CODE_LENGTH + "d", code);
    }

    /**
     *   ✅ TODO: 임시 비밀번호 생성
     * */
    public String generateTemporaryPassword() {
        int length = 10;
        String charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(charSet.length());
            password.append(charSet.charAt(index));
        }

        return password.toString();
    }

    /**
     *   TODO: 인증 코드 발송
     * */
    @Transactional
    public ApiResponseDto<String> sendVerificationCode(String email) {
        String code = generateVerificationCode();
        saveVerificationCode(email, code);
        emailService.sendVerificationEmail(email, code);

        return ApiResponseDto.success(ResponseStatus.SUCCESS);
    }

    /**
     *   TODO: 인증 코드 재발송
     * */
    @Transactional
    public ApiResponseDto<String> resendVerificationCode(String email) {
        invalidateCode(email);
        String code = generateVerificationCode();
        saveVerificationCode(email, code);
        emailService.sendVerificationEmail(email, code);

        return ApiResponseDto.success(ResponseStatus.SUCCESS);
    }

    /**
     *   TODO: 인증 코드 재발송시 기존 코드 삭제
     * */
    @Transactional
    public void invalidateCode(String email) {
        Optional<EmailEntity> existingCode = emailCodeRepository.findByEmail(email);
        existingCode.ifPresent(emailCodeRepository::delete);
    }

    /**
     *   TODO: 인증 코드 저장
     * */
    @Transactional
    public void saveVerificationCode(String email, String verificationCode) {
        Optional<EmailEntity> optionalEmailEntity = emailCodeRepository.findByEmail(email);

        EmailEntity emailEntity = optionalEmailEntity.orElseGet(() ->
                EmailEntity.builder()
                        .email(email)
                        .build()
        );

        // 인증 코드와 만료 시간 업데이트
        emailEntity.updateVerificationCode(verificationCode, LocalDateTime.now().plusMinutes(5));

        emailCodeRepository.save(emailEntity);
    }

    /**
     *   TODO: 인증 코드 검증
     * */
    @Transactional
    public ApiResponseDto<Boolean> verifyCode(EmailCodeRequestDto dto) {

        Optional<EmailEntity> optionalEmailEntity = emailCodeRepository.findByEmail(dto.getEmail());

        if (optionalEmailEntity.isEmpty()) {
            throw new ErrorException(ResponseStatus.INVALID_EMAIL);
        }

        EmailEntity emailEntity = optionalEmailEntity.get();

        if (LocalDateTime.now().isAfter(emailEntity.getExpiryDate())) {
            throw new ErrorException(ResponseStatus.EXPIRED_VERIFICATION_CODE);
        }

        if (!emailEntity.getVerificationCode().equals(dto.getVerificationCode())) {
            throw new ErrorException(ResponseStatus.INCORRECT_VERIFICATION_CODE);
        }

        return ApiResponseDto.success(true);
    }
}
