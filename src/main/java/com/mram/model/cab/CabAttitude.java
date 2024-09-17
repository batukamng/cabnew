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
@Table(name = "tbl_attitude")
public class CabAttitude extends BaseEntity implements GenericEntity<CabAttitude> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long orgId;
    private Long userId;
    private Long evalUserId;
    private String research;
    private String typeStr;
    private String planYr;
    private String typeScr;
    private Double solving, responsibility, attitude, hourUse,teamwork,leadVal,comVal;

    @Override
    public void update(CabAttitude source) {
        this.orgId = source.orgId;
        this.userId = source.userId;
        this.evalUserId = source.evalUserId;
        this.planYr = source.planYr;
        this.attitude = source.attitude;
        this.research = source.research;
        this.solving = source.solving;
        this.responsibility = source.responsibility;
        this.hourUse = source.hourUse;
        this.teamwork = source.teamwork;
        this.leadVal = source.leadVal;
        this.comVal = source.comVal;
        this.typeStr = source.typeStr;
        this.typeScr = source.typeScr;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabAttitude createNewInstance() {
        CabAttitude newInstance = new CabAttitude();
        newInstance.update(this);
        return newInstance;
    }
}
