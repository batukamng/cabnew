package com.mram.repository.notif;

import com.mram.base.repository.GenericRepository;
import com.mram.model.notif.NotificationSeen;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface SeenRepository extends GenericRepository<NotificationSeen> {
    boolean existsByNtfIdAndUserId(Long ntfId, Long userId);

    @Query("from NotificationSeen s where s.ntfId=?1 and s.userId=?2")
    NotificationSeen findByNtfIdAndUserId(Long ntfId, Long userId);
}
