package com.mram.model.cab;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_plan_user_meeting")
public class CabPlanMeeting extends BaseEntity implements GenericEntity<CabPlanMeeting> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;
    private Long objId;
    private Long detId;
    private Long talkerId;
    private int planYr;
    private double progress;
    private String typeStr,fullStr,taskStr,talkDt;

    @Transient
    private String status;

    @Override
    public void update(CabPlanMeeting source) {
        this.planId = source.planId;
        this.userId = source.userId;
        this.objId = source.objId;
        this.detId = source.detId;
        this.talkerId = source.talkerId;
        this.talkDt = source.talkDt;
        this.planYr = source.planYr;
        this.typeStr = source.typeStr;
        this.fullStr = source.fullStr;
        this.taskStr = source.taskStr;
        this.progress = source.progress;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanMeeting createNewInstance() {
        CabPlanMeeting newInstance = new CabPlanMeeting();
        newInstance.update(this);
        return newInstance;
    }
}
