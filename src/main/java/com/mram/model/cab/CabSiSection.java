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
@Table(name = "tbl_si_section")
public class CabSiSection extends BaseEntity implements GenericEntity<CabSiSection> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, code, isActive;
    private Long districId, divisionId, sectionId;

    @Override
    public void update(CabSiSection source) {
        this.name = source.name;
        this.code = source.code;
        this.isActive = source.isActive;
        this.districId = source.districId;
        this.divisionId = source.divisionId;
        this.sectionId = source.sectionId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabSiSection createNewInstance() {
        CabSiSection newInstance = new CabSiSection();
        newInstance.update(this);
        return newInstance;
    }
}
