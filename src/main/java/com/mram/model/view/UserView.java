package com.mram.model.view;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Subselect("SELECT va.* FROM v_user va")
public class UserView implements GenericEntity<UserView> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname,  orgName, roleName, lvlName, typeName;
    private String phone, email;
    private String imageUrl, roleIds;
    private String username,createdAt,createdName,name;

  //  tezName,ttzName,amgName,sumName,
    private Long orgId;
/*    private Long amgId;
    private Long sumId;
    private Long tezId;
    private Long ttzId;*/
    private Long typeId;
    private Long lvlId;

    @JsonIgnore
    private String password;
    private int useYn;

    @Override
    public void update(UserView source) {
        this.phone = source.phone;
    }

    @Override
    public UserView createNewInstance() {
        UserView newInstance = new UserView();
        newInstance.update(this);
        return newInstance;
    }
}