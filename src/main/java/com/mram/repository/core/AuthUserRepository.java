package com.mram.repository.core;

import com.mram.model.core.AuthUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthUserRepository extends CrudRepository<AuthUser, Long> {

    @Query("SELECT c from AuthUser c where lower(c.username) =lower(?1) and c.useYn=1")
    Optional<AuthUser> findByUsername(String username);


}
