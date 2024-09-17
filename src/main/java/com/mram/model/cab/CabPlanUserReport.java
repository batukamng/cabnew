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
@Table(name = "tbl_plan_report")
public class CabPlanUserReport extends BaseEntity implements GenericEntity<CabPlanUserReport> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;
    private Long detId;
    private Long criteriaId;
    private Double progress,percentage;
    private int planYr;
    private String typeStr;
    private String fullStr;

    @Transient
    private String status;

    @Override
    public void update(CabPlanUserReport source) {
        this.planId = source.planId;
        this.userId = source.userId;
        this.detId = source.detId;
        this.criteriaId = source.criteriaId;
        this.planYr = source.planYr;
        this.typeStr = source.typeStr;
        this.fullStr = source.fullStr;
        this.progress = source.progress;
        this.percentage = source.percentage;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanUserReport createNewInstance() {
        CabPlanUserReport newInstance = new CabPlanUserReport();
        newInstance.update(this);
        return newInstance;
    }
}
