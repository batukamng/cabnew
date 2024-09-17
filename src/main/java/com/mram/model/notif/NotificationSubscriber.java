package com.mram.model.notif;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "nt_notification_subscriber")
public class NotificationSubscriber extends BaseEntity implements GenericEntity<NotificationSubscriber> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long channelId;
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channelId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    @JsonIgnore
    private NotificationChannel channel;

    @Override
    public void update(NotificationSubscriber source) {
        this.channelId=source.channelId;
        this.userId=source.userId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public NotificationSubscriber createNewInstance() {
        NotificationSubscriber newInstance = new NotificationSubscriber();
        newInstance.update(this);
        return newInstance;
    }
}
