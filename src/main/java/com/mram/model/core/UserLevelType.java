package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.cmmn.CommonCd;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_user_level_type")
public class UserLevelType extends BaseEntity implements GenericEntity<UserLevelType> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long levId;
    private Long posId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnoreProperties(value = {"lutComCd","lutComCds","related"})
    private CommonCd position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "levId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private UserLevel level;

    @ManyToMany
    @JoinTable(name = "t_user_level_type_role", joinColumns = @JoinColumn(name = "level_type_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"menus","rolePrivileges"})
    private Collection<Role> roles;

    @Override
    public void update(UserLevelType source) {
        this.levId = source.levId;
        this.posId = source.posId;
        this.roles = source.roles;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public UserLevelType createNewInstance() {
        UserLevelType newInstance = new UserLevelType();
        newInstance.update(this);
        return newInstance;
    }
}