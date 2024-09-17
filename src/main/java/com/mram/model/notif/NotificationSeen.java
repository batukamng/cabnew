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
@Table(name = "nt_notification_seen")
public class NotificationSeen extends BaseEntity implements GenericEntity<NotificationSeen> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long ntfId;
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ntfId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private NotificationMessage notification;

    @Override
    public void update(NotificationSeen source) {
        this.ntfId=source.ntfId;
        this.userId=source.userId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public NotificationSeen createNewInstance() {
        NotificationSeen newInstance = new NotificationSeen();
        newInstance.update(this);
        return newInstance;
    }
}
