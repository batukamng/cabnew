package com.mram.repository.core;

import com.mram.base.repository.GenericRepository;
import com.mram.model.core.ActivityLog;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends GenericRepository<ActivityLog> {

    List<ActivityLog> findByLogIdOrderByIdAsc(Long logId);

    List<ActivityLog> findByCodeAndLogIdOrderByIdAsc(String code, Long logId);
}
