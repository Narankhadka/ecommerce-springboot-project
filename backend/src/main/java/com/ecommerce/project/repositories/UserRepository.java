package com.ecommerce.project.repositories;

import com.ecommerce.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.lang.ScopedValue;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    <T> ScopedValue<T> findByUserName(String username);
}
