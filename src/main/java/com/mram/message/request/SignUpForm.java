package com.mram.message.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpForm {

    private Long id;
    private Long orgId;
    private Long amgId;
    private Long sumId;
    private Long tezId;
    private Long ttzId;
    private Long typeId;
    private Long lvlId;
    private int active;
    private int enabled;

    private String username;
    private String firstname;
    private String lastname;
    private String password;
    private String email;
    private String phone;

    private List<Long> rolesArr=new ArrayList<>();

}
