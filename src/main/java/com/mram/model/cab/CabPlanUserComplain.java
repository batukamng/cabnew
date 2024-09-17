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
@Table(name = "tbl_plan_complain")
public class CabPlanUserComplain extends BaseEntity implements GenericEntity<CabPlanUserComplain> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;
    private Long detId;
    private Long criteriaId;
    private String complain,answer;
    private int planYr;

    @Transient
    private String status;

    @Override
    public void update(CabPlanUserComplain source) {
        this.planId = source.planId;
        this.userId = source.userId;
        this.detId = source.detId;
        this.answer = source.answer;
        this.criteriaId = source.criteriaId;
        this.planYr = source.planYr;
        this.complain = source.complain;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanUserComplain createNewInstance() {
        CabPlanUserComplain newInstance = new CabPlanUserComplain();
        newInstance.update(this);
        return newInstance;
    }
}
