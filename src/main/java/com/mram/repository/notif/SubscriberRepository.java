package com.mram.repository.notif;
import com.mram.base.repository.GenericRepository;
import com.mram.model.notif.NotificationSubscriber;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Repository
public interface SubscriberRepository extends GenericRepository<NotificationSubscriber> {
    @Transactional
    @Modifying
    @Query("delete from NotificationSubscriber t where t.channelId=?1 and t.userId=?2")
    void unSubscribe(Long channelId, Long userId);

    @Query("from NotificationSubscriber t where t.channelId=?1 and t.userId=?2")
    Optional<NotificationSubscriber> existsUserId(Long channelId, Long userId);
}
