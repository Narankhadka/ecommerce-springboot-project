package com.ecommerce.project.security.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class UserInfoResponse {
    private Long id;
    private String jwtToken;
    private String username;
    private List<String> roles;

    public UserInfoResponse(Long id, String username, List<String> roles) {
        this.username = username;
        this.roles = roles;
        this.jwtToken = jwtToken;
        this.id = id;
    }


    public UserInfoResponse(List<String> roles, String username,Long id) {
        this.roles = roles;
        this.username = username;
        this.id = id;
    }

    public UserInfoResponse(Long id, String username, List<String> roles, String string) {

    }
}


