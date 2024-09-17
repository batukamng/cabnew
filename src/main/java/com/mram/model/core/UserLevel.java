package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_user_level")
public class UserLevel extends BaseEntity implements GenericEntity<UserLevel> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name;
    private String code;
    private Long typeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "typeId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private LevelConfig level;

    @Transient
    private List<Long> rolesArr;

    @Transient
    private List<Long> levelsArr;

    @ManyToMany
    @JoinTable(name = "t_user_level_roles", joinColumns = @JoinColumn(name = "level_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    @OrderBy(value = "name ASC")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"rolePrivileges"})
    private List<Role> roles;

    @ManyToMany
    @JoinTable(name = "t_user_level_related", joinColumns = @JoinColumn(name = "level_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "rel_id", referencedColumnName = "id"))
    @OrderBy(value = "name ASC")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Collection<UserLevel> levels;

    @OneToMany(mappedBy = "level", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<UserLevelType> levelTypes;

    @OneToMany(mappedBy = "level", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<UserLevelSub> levelSubs;

    @OneToMany(mappedBy = "level", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<UserLevelRequire> levelRequires;

    @Override
    public void update(UserLevel source) {
        this.name = source.name;
        this.roles = source.roles;
        this.typeId = source.typeId;
    //    this.levels = source.levels;
        this.code = source.code;
        this.levelTypes = source.levelTypes;
        this.levelSubs = source.levelSubs;
        this.levelRequires = source.levelRequires;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public UserLevel createNewInstance() {
        UserLevel newInstance = new UserLevel();
        newInstance.update(this);
        return newInstance;
    }
}
