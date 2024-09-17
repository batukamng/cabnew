package com.mram.model.view;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_organization va")
public class OrganizationView extends BaseEntity implements GenericEntity<OrganizationView> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String lpReg,name,phone,web,mobile,address,email;
    private String typeName;
    private int userCnt;
    private Long typeId;

    @Override
    public void update(OrganizationView source) {
        this.phone = source.phone;
    }

    @Override
    public OrganizationView createNewInstance() {
        OrganizationView newInstance = new OrganizationView();
        newInstance.update(this);
        return newInstance;
    }
}