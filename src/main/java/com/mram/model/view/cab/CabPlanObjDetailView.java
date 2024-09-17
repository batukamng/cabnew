package com.mram.model.view.cab;

import com.mram.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_plan_objective_detail va")
public class CabPlanObjDetailView extends BaseEntity {
    @Id
    private Long id;
    private Long objId;
    private Long planId;
    private Long parentId;
    private String title,srtDt,endDt;
    private String criteria;
    private String eventType;
    private String objType;
    private int rowNum;
    private int reqCnt;
    private String targetStr;
    private String baseStr;
    private String userNames;
    private String userIds;
    private String srtDtStr;
    private String endDtStr;
    private String durationStr;
}