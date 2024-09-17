package com.mram.model.view;

import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM v_user_level_role va")
public class UserLevelRoleView implements GenericEntity<UserLevelRoleView> {
    @Id
    private Long id;
    private String levNm,roleNm;
    private Long levelTypeId,roleId;

    @Override
    public void update(UserLevelRoleView source) {
        this.levNm=source.levNm;
        this.roleNm=source.roleNm;
    }

    @Override
    public UserLevelRoleView createNewInstance() {
        UserLevelRoleView newInstance = new UserLevelRoleView();
        newInstance.update(this);
        return newInstance;
    }
}