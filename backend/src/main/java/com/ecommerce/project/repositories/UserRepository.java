package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUserName(String username);

    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);

    Page<User> findByRoles(Role role, Pageable pageable);
}
