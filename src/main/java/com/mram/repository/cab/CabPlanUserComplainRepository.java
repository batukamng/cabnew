package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlanUserComplain;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CabPlanUserComplainRepository extends GenericRepository<CabPlanUserComplain> {

    @Query("from CabPlanUserComplain t where t.userId=?1 and t.planId=?2 and t.criteriaId=?3")
    Optional<CabPlanUserComplain> findByPlanIdUserId(Long userId, Long planId, Long criteriaId);
}
