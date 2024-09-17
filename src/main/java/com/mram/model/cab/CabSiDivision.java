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
@Table(name = "tbl_si_division")
public class CabSiDivision extends BaseEntity implements GenericEntity<CabSiDivision> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, code, isActive;
    private Long divisionGroupId, divisionId, countryId;

    @Override
    public void update(CabSiDivision source) {
        this.name = source.name;
        this.code = source.code;
        this.isActive = source.isActive;
        this.divisionGroupId = source.divisionGroupId;
        this.divisionId = source.divisionId;
        this.countryId = source.countryId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabSiDivision createNewInstance() {
        CabSiDivision newInstance = new CabSiDivision();
        newInstance.update(this);
        return newInstance;
    }
}
