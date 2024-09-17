package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlan;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabPlanRepository extends GenericRepository<CabPlan> {

    @Query("from CabPlan t where t.planYr=?1 and t.orgId=?2")
    Optional<CabPlan> existsYear(int planYr, Long orgId);
}
