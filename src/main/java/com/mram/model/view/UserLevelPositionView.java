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
@Subselect("SELECT va.* FROM v_user_level_position va")
public class UserLevelPositionView implements GenericEntity<UserLevelPositionView> {
    @Id
    private Long id;
    private String levNm,posNm;
    private Long levId,posId;

    @Override
    public void update(UserLevelPositionView source) {
        this.levNm=source.levNm;
        this.posNm=source.posNm;
    }

    @Override
    public UserLevelPositionView createNewInstance() {
        UserLevelPositionView newInstance = new UserLevelPositionView();
        newInstance.update(this);
        return newInstance;
    }
}