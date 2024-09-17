package com.mram.model.core;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.*;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_roles")
public class Role extends BaseEntity implements GenericEntity<Role> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private static final long serialVersionUID = 1L;

    @Column(length = 60)
    private String name;

    @Column(length = 60)
    private String auth;


    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    // @OrderBy("orderId")
    @JsonIgnoreProperties(value = {"menu","role"})
    private List<RolePrivilege> rolePrivileges;

   /* @ManyToMany
    @JoinTable(name = "t_roles_menus", joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "menu_id", referencedColumnName = "id"))
    @OrderBy(value = "orderId ASC")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Collection<LutMenu> menus;*/

    @Override
    public void update(Role source) {
        this.name = source.name;
        this.auth = source.auth;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Role createNewInstance() {
        Role newInstance = new Role();
        newInstance.update(this);
        return newInstance;
    }
}
