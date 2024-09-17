package com.mram.model.notif;

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
@Table(name = "nt_notification")
public class NotificationMessage extends BaseEntity implements GenericEntity<NotificationMessage> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long channelId;
    private String title;
    private String body;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channelId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private NotificationChannel channel;

    @Override
    public void update(NotificationMessage source) {
        this.channelId=source.channelId;
        this.title=source.title;
        this.body=source.body;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public NotificationMessage createNewInstance() {
        NotificationMessage newInstance = new NotificationMessage();
        newInstance.update(this);
        return newInstance;
    }
}
