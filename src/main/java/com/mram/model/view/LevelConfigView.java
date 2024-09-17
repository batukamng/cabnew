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
@Subselect("SELECT va.* FROM v_level_config va")
public class LevelConfigView implements GenericEntity<LevelConfigView> {
    @Id
    private Long id;
    private Long typeId;
    private String typeName,name;
    private String levelNames,levelIds,controlNames,controlIds,typeNames,typeIds,roleNames,roleIds;
    private int useYn;

    @Override
    public void update(LevelConfigView source) {
        this.id=source.id;
    }

    @Override
    public LevelConfigView createNewInstance() {
        LevelConfigView newInstance = new LevelConfigView();
        newInstance.update(this);
        return newInstance;
    }
}