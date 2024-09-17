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
@Subselect("SELECT va.* FROM v_plan_user va")
public class CabPlanUserView extends BaseEntity {
    @Id
    private Long rowNum;
    private Long id;
    private Long orgId;
    private int planYr;
    private int objCnt,objCnt01,objCnt02;
    private int cnt01,subCnt01,cnt02,subCnt02,cnt03,subCnt03,totalCnt;
    private Long userId;
    private String fullDesc;
    private String orgNm,userNm,statusNm,userStatusNm;

}