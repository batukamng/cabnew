package com.mram.model.view;

import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_level va")
public class UserLevelView implements GenericEntity<UserLevelView> {
    @Id
    private Long id;
    private String name;
    private String roleName,roleIds,levelName,levelIds;
    private int useYn;

    @Override
    public void update(UserLevelView source) {
        this.name=source.name;
    }

    @Override
    public UserLevelView createNewInstance() {
        UserLevelView newInstance = new UserLevelView();
        newInstance.update(this);
        return newInstance;
    }
}