package com.mram.config.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.model.core.LutUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {
    private final Long id;
    private final String name;
    private final String username;
    @JsonIgnore
    private final String email;

    @JsonIgnore
    private final String password;

    private final Long orgId;
    private final Long lvlId;


    private final Collection<? extends GrantedAuthority> authorities;


    public UserPrincipal(Long id, String name, String username, String email, Long orgId,  String password, Collection<? extends GrantedAuthority> authorities, Long lvlId) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.orgId = orgId;
        this.password = password;
        this.authorities = authorities;
        this.lvlId = lvlId;
    }

    public static UserPrincipal create(LutUser user) {
        List<GrantedAuthority> authorities = user.getRoles().stream().map(role ->
                new SimpleGrantedAuthority(role.getName())
        ).collect(Collectors.toList());



        String roleName = user.getRoles().stream().findFirst().get().getAuth();


        return new UserPrincipal(
                user.getId(),
                user.getUsername(),
                user.getUsername(),
                user.getEmail(),
                user.getOrgId(),
                user.getPassword(),
                authorities,
                user.getLvlId()
        );
    }




    public Long getLvlId() {
        return lvlId;
    }

    public Long getOrgId() {
        return orgId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }
}
