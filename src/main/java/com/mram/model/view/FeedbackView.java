package com.mram.model.view;


import com.mram.base.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_feedback va")
public class FeedbackView extends BaseEntity{
    @Id
    private Long id;
    private Long typeId, status;
    private String senderData, senderPhone, senderName;
    private String replyData, typeName, fileIds, fileStr;
    private Timestamp replyDate;
}