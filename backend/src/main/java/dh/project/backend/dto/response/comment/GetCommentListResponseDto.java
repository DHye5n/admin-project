package dh.project.backend.dto.response.comment;

import dh.project.backend.domain.BoardEntity;
import dh.project.backend.domain.CommentEntity;
import dh.project.backend.dto.object.CommentListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetCommentListResponseDto {

    private final List<CommentListItem> commentList;

    @Builder
    public GetCommentListResponseDto(List<CommentListItem> commentList) {
        this.commentList = commentList;
    }

    public static GetCommentListResponseDto fromEntity(BoardEntity board, List<CommentEntity> commentEntities) {
        List<CommentListItem> commentList = commentEntities.stream()
                .map(CommentListItem::fromEntity)
                .collect(Collectors.toList());

        return GetCommentListResponseDto.builder()
                .commentList(commentList)
                .build();
    }
}
