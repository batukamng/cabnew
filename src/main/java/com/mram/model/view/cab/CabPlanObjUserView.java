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
@Subselect("select va.* from v_plan_user_obj va")
public class CabPlanObjUserView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private Long userId;
    private Long objId;
    private Long parentId;
    private String title;
    private String objType;
    private String objTypeNm;
    private String userType;
    private String eventType;
    private int criteriaCnt;
    private int reqCnt;
    private int planYr;

    private String srtDt;
    private String endDt;
    private String criteria;

    private Double baseline, firstHalf, secondHalf, rate, fulfillment;
}
