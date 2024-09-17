package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabCriteria;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabCriteriaRepository extends GenericRepository<CabCriteria> {

    @Query("from CabCriteria t where t.orgId=?1 and t.title=?2")
    Optional<CabCriteria> existsItem(long orgId, String criteria);
}
