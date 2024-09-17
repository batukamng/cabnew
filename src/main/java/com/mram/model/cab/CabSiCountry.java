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
@Table(name = "tbl_si_country")
public class CabSiCountry extends BaseEntity implements GenericEntity<CabSiCountry> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, code, isActive;
    private Long isManufacturer, countryId;

    @Override
    public void update(CabSiCountry source) {
        this.name = source.name;
        this.code = source.code;
        this.isActive = source.isActive;
        this.isManufacturer = source.isManufacturer;
        this.countryId = source.countryId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabSiCountry createNewInstance() {
        CabSiCountry newInstance = new CabSiCountry();
        newInstance.update(this);
        return newInstance;
    }
}
