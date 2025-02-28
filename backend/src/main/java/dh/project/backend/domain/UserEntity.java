package dh.project.backend.domain;

import dh.project.backend.enums.Role;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Table(name = "user",
        indexes = {
                @Index(name = "user_username_idx", columnList = "username", unique = true),
                @Index(name = "user_email_idx", columnList = "email", unique = true)
        }
)
@SQLDelete(sql = "UPDATE \"user\" SET deleted_date = CURRENT_TIMESTAMP WHERE user_id = ?")
@Where(clause = "deleted_date IS NULL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity(name = "user")
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

    @Column(length = 10, nullable = false)
    private String zonecode;

    @Column(length = 30, nullable = false)
    private String address;

    @Column(length = 30, nullable = false)
    private String addressDetail;

    @Column
    private String profileImage;

    @Column(nullable = false)
    private boolean agreedPersonal;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role;

    private int followersCount = 0;

    private int followingsCount = 0;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<BoardEntity> boards = new ArrayList<>();

    @Builder
    public UserEntity(Long userId, String email, String password, String username, String phone,
                      String zonecode, String address, String addressDetail, String profileImage,
                      boolean agreedPersonal, Role role, int followersCount, int followingsCount) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.username = username;
        this.phone = phone;
        this.zonecode = zonecode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.profileImage = profileImage;
        this.agreedPersonal = agreedPersonal;
        this.role = role != null ? role : Role.USER;
        this.followersCount = followersCount;
        this.followingsCount = followingsCount;
    }

    public void patchUsername(String username) {
        this.username = username;
    }

    public void patchProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public void patchPassword(String newPassword) {
        this.password = newPassword;
    }
}
