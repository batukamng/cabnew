package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabRateDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabRateDetailRepository extends GenericRepository<CabRateDetail> {

    @Query("from CabRateDetail t where t.rateId=?1 and t.criteriaId=?2")
    Optional<CabRateDetail> existsItem(Long planId, Long criteriaId);
}
