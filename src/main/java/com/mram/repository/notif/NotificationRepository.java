package com.mram.repository.notif;

import com.mram.base.repository.GenericRepository;
import com.mram.model.notif.NotificationMessage;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationRepository extends GenericRepository<NotificationMessage> {

}
