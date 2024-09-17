package com.mram.repository.core;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.UserLevelType;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface UserLevelTypeRepository extends GenericRepository<UserLevelType> {

    @Transactional
    @Modifying
    @Query("delete from UserLevelType t where t.levId=?1")
    void deleteByLevelId(Long id);
}
