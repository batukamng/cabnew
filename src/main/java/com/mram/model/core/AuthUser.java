package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
public class AuthUser extends BaseEntity implements UserDetails {

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
        private Long orgId,lvlId;
        private int enabled=0;

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

        @ManyToMany
        @JoinTable(name = "t_user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnoreProperties(value = {"menus","rolePrivileges"})
        private Collection<Role> roles;


        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                return List.of();
        }

        @Override
        public boolean isAccountNonExpired() {
                return false;
        }

        @Override
        public boolean isAccountNonLocked() {
                return false;
        }

        @Override
        public boolean isCredentialsNonExpired() {
                return false;
        }

        @Override
        public boolean isEnabled() {
                return false;
        }
}
