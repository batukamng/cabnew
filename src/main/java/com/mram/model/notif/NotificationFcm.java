package com.mram.model.notif;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.LutUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "nt_notification_user_fcm")
public class NotificationFcm extends BaseEntity implements GenericEntity<NotificationFcm> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long userId;
    private String fcm;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId",nullable = false,insertable = false,updatable = false)
    @JsonIgnore
    private LutUser user;

    @Override
    public void update(NotificationFcm source) {
        this.userId=source.userId;
        this.fcm=source.fcm;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public NotificationFcm createNewInstance() {
        NotificationFcm newInstance = new NotificationFcm();
        newInstance.update(this);
        return newInstance;
    }
}
