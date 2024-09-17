package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlanUserRate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CabPlanUserRateRepository extends GenericRepository<CabPlanUserRate> {

    @Query("from CabPlanUserRate t where t.planId=?1 and t.season=?2")
    Optional<CabPlanUserRate> existsSeason(Long planId, String season);
}
