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
@Table(name = "tbl_plan_config")
public class CabPlanConfig extends BaseEntity implements GenericEntity<CabPlanConfig> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    private int planYr;
    private double objPer;
    private double attitudePer;
    private double skillPer;



    @Override
    public void update(CabPlanConfig source) {
        this.objPer = source.objPer;
        this.planYr = source.planYr;
        this.attitudePer = source.attitudePer;
        this.skillPer = source.skillPer;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanConfig createNewInstance() {
        CabPlanConfig newInstance = new CabPlanConfig();
        newInstance.update(this);
        return newInstance;
    }
}
