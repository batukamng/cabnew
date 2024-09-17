package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlanUserScore;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CabPlanUserScoreRepository extends GenericRepository<CabPlanUserScore> {

    @Query("from CabPlanUserScore t where t.userId=?1 and t.planId=?2 and t.criteriaId=?3")
    Optional<CabPlanUserScore> findByPlanIdUserId(Long userId, Long planId, Long criteriaId);
}
