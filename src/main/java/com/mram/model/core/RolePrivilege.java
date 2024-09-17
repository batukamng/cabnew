package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_roles_privileges")
public class RolePrivilege extends BaseEntity implements GenericEntity<RolePrivilege> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
  //  private String actionButton;
    private Long menuId;
    private Long roleId;
    private Long privilegeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "menuId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private Menu menu;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinColumn(name = "roleId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private Role role;

    @Override
    public void update(RolePrivilege source) {
       // this.actionButton = source.actionButton;
        this.menuId = source.menuId;
        this.roleId = source.roleId;
        this.privilegeId = source.privilegeId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public RolePrivilege createNewInstance() {
        RolePrivilege newInstance = new RolePrivilege();
        newInstance.update(this);
        return newInstance;
    }
}