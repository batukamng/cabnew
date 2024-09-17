package com.mram.model.view.cab;

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
@Subselect("select va.* from v_dashboard va")
public class DashboardView {
    @Id
    private Long orgId;
    private Long planId;
    private int strategyCnt,objectiveCnt,eventCnt,aprPlanCnt,repCnt,aprRepCnt, userCnt;
    private double ttlPer,ttlAprPer;

}