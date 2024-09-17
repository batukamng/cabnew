package com.mram.model.cab;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.LutUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_team")
public class CabTeam extends BaseEntity implements GenericEntity<CabTeam> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long orgId;
    private String title;

    @Transient
    List<String> userArr=new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "tbl_team_users", joinColumns = @JoinColumn(name = "team_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Collection<LutUser> users;

    @Override
    public void update(CabTeam source) {
        this.title = source.title;
        this.orgId = source.orgId;
        this.users = source.users;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabTeam createNewInstance() {
        CabTeam newInstance = new CabTeam();
        newInstance.update(this);
        return newInstance;
    }
}
