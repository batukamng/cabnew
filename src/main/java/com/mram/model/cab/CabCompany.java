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
@Table(name = "tbl_company")
public class CabCompany extends BaseEntity implements GenericEntity<CabCompany> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, address, phone, fax, isShowDashboard, disolveDate;
    private Long companyId, parentId;

    @Override
    public void update(CabCompany source) {
        this.name = source.name;
        this.address = source.address;
        this.phone = source.phone;
        this.companyId = source.companyId;
        this.fax = source.fax;
        this.isShowDashboard = source.isShowDashboard;
        this.disolveDate = source.disolveDate;
        this.parentId = source.parentId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabCompany createNewInstance() {
        CabCompany newInstance = new CabCompany();
        newInstance.update(this);
        return newInstance;
    }
}
