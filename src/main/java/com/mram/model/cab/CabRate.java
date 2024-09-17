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
@Table(name = "tbl_rate")
public class CabRate extends BaseEntity implements GenericEntity<CabRate> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;
    private String typeStr;
    //private String planYr;
    @Transient
    private String status;

    @Override
    public void update(CabRate source) {
        this.planId = source.planId;
        this.userId = source.userId;
        this.typeStr = source.typeStr;
       // this.planYr = source.planYr;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabRate createNewInstance() {
        CabRate newInstance = new CabRate();
        newInstance.update(this);
        return newInstance;
    }
}
