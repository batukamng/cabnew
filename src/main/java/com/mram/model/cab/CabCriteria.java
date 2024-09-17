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
@Table(name = "tbl_criteria")
public class CabCriteria extends BaseEntity implements GenericEntity<CabCriteria> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long orgId;
    private String title;

    @Override
    public void update(CabCriteria source) {
        this.title = source.title;
        this.orgId = source.orgId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabCriteria createNewInstance() {
        CabCriteria newInstance = new CabCriteria();
        newInstance.update(this);
        return newInstance;
    }
}
