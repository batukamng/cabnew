package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabPlanAttitude;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabPlanAttitudeRepository extends GenericRepository<CabPlanAttitude> {

    @Query("from CabPlanAttitude t where t.userId=?1 and t.typeStr=?2 and t.planId=?3 and t.typeScr=?4")
    Optional<CabPlanAttitude> existItem(Long userId, String typeStr, Long planId,String typeScr);

    @Query("from CabPlanAttitude t where t.userId=?1 and t.typeStr=?2 and t.planId=?3 and t.typeScr=?4 and t.evalUserId=?5")
    Optional<CabPlanAttitude> existCommunityItem(Long userId, String typeStr, Long planId, String typeScr, Long evalUserId);
}
