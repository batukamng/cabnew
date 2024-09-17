package com.mram.model.core;

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
@Table(name = "t_mail_notification_log")
public class MailNotifLog extends BaseEntity implements GenericEntity<MailNotifLog> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;

    private String message;
    private String type;
    private String topic;
    private Long userId;

    @Override
    public void update(MailNotifLog source) {
        this.id = source.id;
        this.type = source.type;
        this.message = source.message;
        this.userId = source.userId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public MailNotifLog createNewInstance() {
        MailNotifLog newInstance = new MailNotifLog();
        newInstance.update(this);
        return newInstance;
    }
}