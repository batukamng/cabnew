package com.mram.repository.cab;

import com.mram.base.repository.GenericRepository;
import com.mram.model.cab.CabRate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabRateRepository extends GenericRepository<CabRate> {

    @Query("from CabRate t where t.planId=?1 and t.userId=?2 and t.typeStr=?3")
    Optional<CabRate> existsItem(Long planId,Long userId, String month);
}
