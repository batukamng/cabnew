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
@Table(name = "t_user_level_require")
public class UserLevelRequire extends BaseEntity implements GenericEntity<UserLevelRequire> {
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
    @JoinTable(name = "t_user_level_lnk_require", joinColumns = @JoinColumn(name = "lev_id"), inverseJoinColumns = @JoinColumn(name = "req_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties(value = {"lutComCd","lutComCds","related","requireTypes"})
    private Collection<CommonCd> requires;

    @Override
    public void update(UserLevelRequire source) {
        this.levId = source.levId;
        this.posId = source.posId;
        this.requires = source.requires;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public UserLevelRequire createNewInstance() {
        UserLevelRequire newInstance = new UserLevelRequire();
        newInstance.update(this);
        return newInstance;
    }
}