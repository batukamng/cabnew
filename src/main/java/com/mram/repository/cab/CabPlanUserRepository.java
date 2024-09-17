package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlanUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CabPlanUserRepository extends GenericRepository<CabPlanUser> {

    @Query("from CabPlanUser t where t.userId=?1 and t.planId=?2")
    Optional<CabPlanUser> existsUserPlan(long userId, long planId);

    @Query("from CabPlanUser t where t.userId=?1 and t.planId=?2")
    CabPlanUser getByPlanUser(long userId, long planId);
}
