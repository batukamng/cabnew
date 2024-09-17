package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabAttitude;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabAttitudeRepository extends GenericRepository<CabAttitude> {

    @Query("from CabAttitude t where t.userId=?1 and t.planYr=?2")
    Optional<CabAttitude> existItem(Long userId, String planYr);

}
