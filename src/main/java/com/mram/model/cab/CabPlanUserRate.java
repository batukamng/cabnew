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
@Table(name = "tbl_plan_rate")
public class CabPlanUserRate extends BaseEntity implements GenericEntity<CabPlanUserRate> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Double hourUse;
    private Double research;
    private Double responsibility;
    private Double solving;
    private Double attitude;
    private String season;

    @Override
    public void update(CabPlanUserRate source) {
        this.hourUse = source.hourUse;
        this.research = source.research;
        this.responsibility = source.responsibility;
        this.solving = source.solving;
        this.attitude = source.attitude;
        this.season = source.season;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanUserRate createNewInstance() {
        CabPlanUserRate newInstance = new CabPlanUserRate();
        newInstance.update(this);
        return newInstance;
    }
}
