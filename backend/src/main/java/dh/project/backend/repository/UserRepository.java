package dh.project.backend.repository;

import dh.project.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    Optional<UserEntity> findByUsername(String username);



    boolean existsByUsername(String username);

    boolean existsByPhone(String phone);
}
