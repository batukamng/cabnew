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
@Table(name = "tbl_rate_detail")
public class CabRateDetail extends BaseEntity implements GenericEntity<CabRateDetail> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long rateId;
    private Long criteriaId;
    private Double score;

    @Override
    public void update(CabRateDetail source) {
        this.rateId = source.rateId;
        this.criteriaId = source.criteriaId;
        this.score = source.score;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabRateDetail createNewInstance() {
        CabRateDetail newInstance = new CabRateDetail();
        newInstance.update(this);
        return newInstance;
    }
}
