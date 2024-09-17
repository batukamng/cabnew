package com.mram.repository.core;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.UserLevel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLevelRepository extends GenericRepository<UserLevel> {
    @Query("select a from UserLevel a where a.id = ?1")
    UserLevel getOneById(Long id);

    @Query("from UserLevel a where a.useYn = 1 and a.code=?1")
    UserLevel findByCode(String code);

}
