package dh.project.backend.domain.user;

import dh.project.backend.domain.BaseTime;
import dh.project.backend.enums.Role;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Table(name = "user",
        indexes = {
                @Index(name = "user_username_idx", columnList = "username", unique = true),
                @Index(name = "user_email_idx", columnList = "email", unique = true)
        }
)
@SQLDelete(sql = "UPDATE user SET deleted_date = CURRENT_TIMESTAMP WHERE userid = ?")
@Where(clause = "deleted_date IS NULL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class UserEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(length = 30, nullable = false, unique = true)
    private String email;

    @Column(length = 60, nullable = false)
    private String password;

    @Column(length = 10, nullable = false, unique = true)
    private String username;

    @Column(length = 11, nullable = false)
    private String phone;

    @Column(length = 10)
    private String zonecode;

    @Column(length = 30)
    private String address;

    @Column(length = 30)
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role;


    @Builder
    public UserEntity(String email, String password, String username, String phone,
                      String zonecode, String address, String addressDetail, Role role) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.phone = phone;
        this.zonecode = zonecode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.role = role != null ? role : Role.USER;
    }
}