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
@Table(name = "tbl_plan_user_status")
public class CabPlanUser extends BaseEntity implements GenericEntity<CabPlanUser> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;

    @Transient
    private String status;

    @Override
    public void update(CabPlanUser source) {
        this.planId = source.planId;
        this.userId = source.userId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanUser createNewInstance() {
        CabPlanUser newInstance = new CabPlanUser();
        newInstance.update(this);
        return newInstance;
    }
}
