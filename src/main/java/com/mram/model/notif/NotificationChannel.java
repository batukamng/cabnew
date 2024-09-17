package com.mram.model.notif;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.UserLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "nt_notification_channel")
public class NotificationChannel extends BaseEntity implements GenericEntity<NotificationChannel> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String code;
    private String topic;
    private String descText;
    private Long fileId,lvlId,typeId;

/*    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "typeId",nullable = false,insertable = false,updatable = false)
    private CommonCd userType;*/

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lvlId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnoreProperties(value = {"roles"})
    private UserLevel level;

    @OneToMany(mappedBy = "channel", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<NotificationSubscriber> subscribers;

    @Override
    public void update(NotificationChannel source) {
        this.code=source.code;
        this.topic=source.topic;
        this.descText=source.descText;
        this.fileId=source.fileId;
        this.lvlId=source.lvlId;
        this.typeId=source.typeId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public NotificationChannel createNewInstance() {
        NotificationChannel newInstance = new NotificationChannel();
        newInstance.update(this);
        return newInstance;
    }
}