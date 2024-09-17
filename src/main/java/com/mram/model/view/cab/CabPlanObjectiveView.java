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
@Subselect("SELECT va.* FROM v_plan_objective va")
public class CabPlanObjectiveView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private int rowNum,userCnt;
    private String title;
    private String objType;
    private String objTypeNm,userNames,userIds;

}