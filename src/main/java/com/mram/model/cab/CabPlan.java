package com.mram.model.cab;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_plan")
public class CabPlan extends BaseEntity implements GenericEntity<CabPlan> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long orgId;
    private int planYr;
    private String fullDesc;
    @Transient
    private String status;
    @Transient
    private Long userId;

    @OneToMany(mappedBy = "cabPlan", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CabPlanObjective> objectives;

    @Override
    public void update(CabPlan source) {
        this.orgId = source.orgId;
        this.planYr = source.planYr;
        this.fullDesc = source.fullDesc;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlan createNewInstance() {
        CabPlan newInstance = new CabPlan();
        newInstance.update(this);
        return newInstance;
    }
}
