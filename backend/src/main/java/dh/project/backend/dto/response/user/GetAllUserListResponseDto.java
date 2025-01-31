package dh.project.backend.dto.response.user;

import dh.project.backend.dto.object.UserListItem;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class GetAllUserListResponseDto {

    private final List<UserListItem> userList;

    @Builder
    public GetAllUserListResponseDto(List<UserListItem> userList) {
        this.userList = userList;
    }
}
