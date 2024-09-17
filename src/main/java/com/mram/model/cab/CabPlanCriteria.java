package com.mram.model.cab;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "tbl_plan_criteria")
public class CabPlanCriteria extends BaseEntity implements GenericEntity<CabPlanCriteria> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long detId;
    private Long userId;
    private String criteria;
    private String srtDt;
    private String endDt;
    private String reached;
    private String targetStr;
    private String baseStr;
    private Double baseline, firstHalf, secondHalf, rate, fulfillment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private CabPlanDetail detail;

    @Override
    public void update(CabPlanCriteria source) {
        this.detId = source.detId;
        this.baseline = source.baseline;
        this.srtDt = source.srtDt;
        this.endDt = source.endDt;
        this.rate = source.rate;
        this.criteria = source.criteria;
        this.firstHalf = source.firstHalf;
        this.secondHalf = source.secondHalf;
        this.reached = source.reached;
        this.userId = source.userId;
        this.fulfillment = source.fulfillment;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanCriteria createNewInstance() {
        CabPlanCriteria newInstance = new CabPlanCriteria();
        newInstance.update(this);
        return newInstance;
    }
}
