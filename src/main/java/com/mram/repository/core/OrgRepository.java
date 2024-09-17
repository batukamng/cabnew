package com.mram.repository.core;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Organization;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface OrgRepository extends GenericRepository<Organization> {

    @Query("SELECT u FROM Organization u WHERE u.lpReg = ?1")
    Optional<Organization> findByLpReg(String lpReg);


    boolean existsByLpReg(String lpReg);
}
