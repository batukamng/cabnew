package com.mram.model.cab;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_plan_score")
public class CabPlanUserScore extends BaseEntity implements GenericEntity<CabPlanUserScore> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;
    private Long detId;
    private Long criteriaId;
    private Double eval,apr;
    private int planYr;

    @Transient
    private String status;

    @Override
    public void update(CabPlanUserScore source) {
        this.planId = source.planId;
        this.userId = source.userId;
        this.detId = source.detId;
        this.criteriaId = source.criteriaId;
        this.planYr = source.planYr;
        this.eval = source.eval;
        this.apr = source.apr;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanUserScore createNewInstance() {
        CabPlanUserScore newInstance = new CabPlanUserScore();
        newInstance.update(this);
        return newInstance;
    }
}
