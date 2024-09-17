package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlanConfig;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CabPlanConfigRepository extends GenericRepository<CabPlanConfig> {

    @Query("from CabPlanConfig t where t.planYr=?1")
    Optional<CabPlanConfig> existsByPlanYr(int planYr);
}
