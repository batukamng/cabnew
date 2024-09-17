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
@Table(name = "tbl_plan_request")
public class CabPlanRequest extends BaseEntity implements GenericEntity<CabPlanRequest> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long detId;
    private Long userId;
    private Long planId;
    private String title;
    private String answer;
    private String responseType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private CabPlanDetail detail;

    @Override
    public void update(CabPlanRequest source) {
        this.detId = source.detId;
        this.planId = source.planId;
        this.userId = source.userId;
        this.title = source.title;
        this.answer = source.answer;
        this.responseType = source.responseType;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanRequest createNewInstance() {
        CabPlanRequest newInstance = new CabPlanRequest();
        newInstance.update(this);
        return newInstance;
    }
}
