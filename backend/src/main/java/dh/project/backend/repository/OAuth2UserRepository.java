//package dh.project.backend.repository;
//
//import dh.project.backend.domain.OAuth2UserEntity;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface OAuth2UserRepository extends JpaRepository<OAuth2UserEntity, Long> {
//
//    Optional<OAuth2UserEntity> findByEmailAndProvider(String email, String provider);
//
//    Optional<OAuth2UserEntity> findByEmail(String email);
//
//}
