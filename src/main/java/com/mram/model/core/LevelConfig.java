package com.mram.model.core;

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
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_level_config")
public class LevelConfig extends BaseEntity implements GenericEntity<LevelConfig> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name;
    private String code;
    private Long typeId;

    @Transient
    private List<Long> controlsArr;

    @Transient
    private List<Long> levelsArr;

    @Transient
    private List<Long> typesArr;
    @Transient
    private List<Long> rolesArr;

    @ManyToOne(fetch = FetchType.LAZY)
    @OrderBy("orderId")
    @JoinColumn(name = "typeId", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private CommonCd level;

    @ManyToMany
    @JoinTable(name = "t_level_config_control", joinColumns = @JoinColumn(name = "config_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "control_id", referencedColumnName = "id"))
    @OrderBy(value = "comCdNm ASC")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"lutComCd"})
    private Collection<CommonCd> controls;

    @ManyToMany
    @JoinTable(name = "t_level_config_level", joinColumns = @JoinColumn(name = "config_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "level_id", referencedColumnName = "id"))
    @OrderBy(value = "name ASC")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"roles","levels","levelTypes","levelSubs","levelRequires","level"})
    private Collection<UserLevel> levels;

    @ManyToMany
    @JoinTable(name = "t_level_config_type", joinColumns = @JoinColumn(name = "config_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "type_id", referencedColumnName = "id"))
    @OrderBy(value = "comCdNm ASC")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"lutComCd"})
    private Collection<CommonCd> types;

    @ManyToMany
    @JoinTable(name = "t_level_config_role", joinColumns = @JoinColumn(name = "config_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"rolePrivileges"})
    private Collection<Role> roles;

    @Override
    public void update(LevelConfig source) {
        this.name = source.name;
        this.typeId = source.typeId;
        this.controls = source.controls;
        this.levels = source.levels;
        this.types = source.types;
        this.code = source.code;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public LevelConfig createNewInstance() {
        LevelConfig newInstance = new LevelConfig();
        newInstance.update(this);
        return newInstance;
    }
}
