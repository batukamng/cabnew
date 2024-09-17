package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.dto.PrivilegeDto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Entity
@Table(name = "t_users"//, uniqueConstraints = { @UniqueConstraint(columnNames = { "username" }),
                /*
                 * @UniqueConstraint(columnNames = { "email" })
                 */
)
public class LutUser extends BaseEntity implements GenericEntity<LutUser> {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name="id", unique = true, nullable = false)
        private Long id;
        private String username;
        private String email;
        private String phone;
        //@JsonIgnore
        @NotNull
        @NotEmpty
        @Size(min = 3, max = 64)
        private String password;
        private Long orgId,lvlId,imgId;
        private int enabled=0;

        private int emailVerified;
        private int phoneVerified;
        private int profileVerified;

        @JsonFormat(pattern="yyyy.MM.dd HH:mm",timezone = "GMT+08:00")
        private Instant lastPasswordUpdated;


        @Transient
        private Long pushEmail,pushWeb,pushNews,pushSystem;

        @Transient
        private String firstname,lastname;

        @Transient
        private Long posId;

        @Transient
        private List<Long> rolesArr;

        @Transient
        private List<Module> modules;

        @Transient
        private List<Menu> menus;

        @Transient
        private List<PrivilegeDto> privileges;

        @Transient
        private String newPassword;

        @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
        @JsonIgnore
        private VerificationToken verificationToken;

        @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
        private Profile detail;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "lvlId", referencedColumnName = "id", insertable = false, updatable = false)
        @JsonIgnoreProperties(value = {"roles"})
        private UserLevel level;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "orgId", referencedColumnName = "id", insertable = false, updatable = false)
        @JsonIgnoreProperties(value = {"aimag","soum"})
        private Organization organization;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "imgId", referencedColumnName = "id", insertable = false, updatable = false)
        @JsonIgnoreProperties(value = {"lutUser"})
        private AttFile avatar;

        @ManyToMany
        @JoinTable(name = "t_user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnoreProperties(value = {"menus","rolePrivileges"})
        private Collection<Role> roles;

        @Override
        public void update(LutUser source) {
               this.username=source.username;
               this.password=source.password;
               this.orgId=source.orgId;
               this.lvlId=source.lvlId;
               this.enabled=source.enabled;
               this.phone=source.phone;
               this.roles=source.roles;
/*               this.accountNonExpired=source.accountNonExpired;
               this.accountNonLocked=source.accountNonLocked;
               this.credentialsNonExpired=source.credentialsNonExpired;*/
               this.setUseYn(source.getUseYn());
        }

        @Override
        public LutUser createNewInstance() {
               LutUser newInstance = new LutUser();
               newInstance.update(this);
               return newInstance;
        }
}
