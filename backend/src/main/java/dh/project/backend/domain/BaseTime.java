package dh.project.backend.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseTime {


    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    @JsonFormat(pattern = "yy-MM-dd HH:mm:ss")
    protected LocalDateTime createdDate;


    @LastModifiedDate
    @Column(name = "modified_date", nullable = false)
    @JsonFormat(pattern = "yy-MM-dd HH:mm:ss")
    protected LocalDateTime modifiedDate;


    @Column(name = "deleted_date")
    @JsonFormat(pattern = "yy-MM-dd HH:mm:ss")
    protected LocalDateTime deletedDate;
}
