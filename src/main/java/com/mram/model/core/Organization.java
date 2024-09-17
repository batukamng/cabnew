package com.mram.model.core;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_organization")
public class Organization extends BaseEntity implements GenericEntity<Organization> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String lpReg,name,phone,web,mobile;
    private String email,address;

    private Long imgId,typeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imgId", referencedColumnName = "id", insertable = false, updatable = false)
    private AttFile avatar;

    @ManyToMany
    @JoinTable(name = "t_organization_images", joinColumns = @JoinColumn(name = "org_id"), inverseJoinColumns = @JoinColumn(name = "img_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Collection<AttFile> images;

    @Override
    public void update(Organization source) {
        this.name=source.name;
        this.imgId=source.imgId;
        this.typeId=source.typeId;
        this.address=source.address;
        this.lpReg=source.lpReg;
        this.phone=source.phone;
        this.web=source.web;
        this.mobile=source.mobile;
        this.email=source.email;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Organization createNewInstance() {
        Organization newInstance = new Organization();
        newInstance.update(this);
        return newInstance;
    }
}
