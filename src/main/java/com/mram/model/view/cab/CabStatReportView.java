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
@Subselect("SELECT va.* FROM v_stat_report va")
public class CabStatReportView {
    @Id
    private Long rowNum;
    private Long userId;
    private Long orgId;
    private int planYr;
    private int sentCnt,aprCnt;
    private String planNm,orgNm,userNm,imageUrl;

}