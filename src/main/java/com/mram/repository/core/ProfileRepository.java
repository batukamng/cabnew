package com.mram.repository.core;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.Profile;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends GenericRepository<Profile> {

    boolean existsByUserId(Long id);

    @Query("from Profile t where t.userId=?1")
    Profile findByUserId(Long id);
}
