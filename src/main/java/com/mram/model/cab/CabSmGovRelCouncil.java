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
@Table(name = "tbl_sm_Gov_Rel_Council")
public class CabSmGovRelCouncil extends BaseEntity implements GenericEntity<CabSmGovRelCouncil> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, isActive;
    private Long govRelCouncilId;

    @Override
    public void update(CabSmGovRelCouncil source) {
        this.name = source.name;
        this.isActive = source.isActive;
        this.govRelCouncilId = source.govRelCouncilId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabSmGovRelCouncil createNewInstance() {
        CabSmGovRelCouncil newInstance = new CabSmGovRelCouncil();
        newInstance.update(this);
        return newInstance;
    }
}
