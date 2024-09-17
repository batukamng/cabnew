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
@Table(name = "si_district")
public class CabSiDistrict extends BaseEntity implements GenericEntity<CabSiDistrict> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, code, isActive, isProvinceCenter;
    private Long districId, divisionId, countryId, shortName;

    @Override
    public void update(CabSiDistrict source) {
        this.name = source.name;
        this.code = source.code;
        this.isActive = source.isActive;
        this.districId = source.districId;
        this.divisionId = source.divisionId;
        this.isProvinceCenter = source.isProvinceCenter;
        this.countryId = source.countryId;
        this.shortName = source.shortName;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabSiDistrict createNewInstance() {
        CabSiDistrict newInstance = new CabSiDistrict();
        newInstance.update(this);
        return newInstance;
    }
}
