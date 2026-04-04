package com.ecommerce.project.serviceInterface;

import java.util.Map;

public interface AdminUserService {
    Map<String, Object> getUsers(int pageNumber, int pageSize, String sortBy, String sortOrder, String keyword);
    void deleteUser(Long userId, String adminUsername);
}
