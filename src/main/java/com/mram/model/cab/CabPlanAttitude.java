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
@Table(name = "tbl_plan_attitude")
public class CabPlanAttitude extends BaseEntity implements GenericEntity<CabPlanAttitude> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long userId;
    private Long planId;
    private Long evalUserId;
    private String research;
    private String typeStr;
    private String typeScr;
    private Double solving, responsibility, attitude, hourUse,teamwork,leadVal,comVal;

    @Override
    public void update(CabPlanAttitude source) {
        this.attitude = source.attitude;
        this.research = source.research;
        this.solving = source.solving;
        this.planId = source.planId;
        this.responsibility = source.responsibility;
        this.hourUse = source.hourUse;
        this.teamwork = source.teamwork;
        this.leadVal = source.leadVal;
        this.comVal = source.comVal;
        this.typeStr = source.typeStr;
        this.typeScr = source.typeScr;
        this.evalUserId = source.evalUserId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanAttitude createNewInstance() {
        CabPlanAttitude newInstance = new CabPlanAttitude();
        newInstance.update(this);
        return newInstance;
    }
}
