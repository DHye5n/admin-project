//package dh.project.backend.domain;
//
//import dh.project.backend.enums.Role;
//import lombok.AccessLevel;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import javax.persistence.*;
//
//@Table(name = "oauth2", indexes = {
//        @Index(name = "email_provider_idx", columnList = "providerId, email")
//})
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@Getter
//@Entity(name = "oauth2")
//public class OAuth2UserEntity extends BaseTime {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(length = 50, unique = true)
//    private String provider;
//
//    @Column(length = 150)
//    private String providerId;
//
//    @Column(length = 30, unique = true)
//    private String email;
//
//    @Column(length = 50)
//    private String username;
//
//    @Column(length = 30)
//    private String name;
//
//    @Column(length = 20)
//    private String phoneNumber;
//
//    @Column
//    private String profileImage;
//
//    @Enumerated(EnumType.STRING)
//    @Column(length = 20)
//    private Role role;
//
//    @Builder
//    public OAuth2UserEntity(String provider, String providerId, String email,
//                            String username, String name, String phoneNumber, String profileImage, Role role) {
//        this.provider = provider;
//        this.providerId = providerId;
//        this.email = email;
//        this.username = username;
//        this.name = name;
//        this.phoneNumber = phoneNumber;
//        this.profileImage = profileImage;
//        this.role = role != null ? role : Role.SOCIAL;
//    }
//}
