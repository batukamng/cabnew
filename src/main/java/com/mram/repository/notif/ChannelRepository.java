package com.mram.repository.notif;
import com.mram.base.repository.GenericRepository;
import com.mram.model.notif.NotificationChannel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ChannelRepository extends GenericRepository<NotificationChannel> {

    @Query("select t.id from NotificationChannel t where t.code=?1 and t.topic=?2")
    Long findByCodeTopic(String proposal, String topic);

    @Query("from NotificationChannel t where t.code=?1 and t.topic=?2")
    Optional<NotificationChannel> getByCodeTopic(String code, String topic);


}
