package com.mram.repository.notif;

import com.mram.base.repository.GenericRepository;
import com.mram.model.notif.NotificationFcm;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FcmRepository extends GenericRepository<NotificationFcm> {

    @Query("from NotificationFcm f where f.userId=?1")
    List<NotificationFcm> findByUserId(Long userId);

    @Query("select CASE WHEN COUNT(f.id) > 0 THEN true ELSE false END from NotificationFcm f where f.userId=?1 and f.fcm=?2")
    boolean existsUserToken(Long id, String token);

}