package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.cmmn.CommonCd;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_users_detail")
public class Profile extends BaseEntity implements GenericEntity<Profile> {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name="id", unique = true, nullable = false)
        private Long id;
        private Long userId;
        private Long amgId,sumId,orgId,tezId,typeId,ttzId;
        private String firstname,lastname,fcmToken,color;
        private Long pushNews,pushWeb,pushEmail,pushSystem,imgId;

        @ManyToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "orgId",nullable = false,insertable = false,updatable = false)
        private Organization organization;

        @ManyToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "typeId",nullable = false,insertable = false,updatable = false)
        private CommonCd userType;

        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "userId",nullable = false,insertable = false,updatable = false)
        @JsonIgnore
        private LutUser user;

        @Override
        public void update(Profile source) {
                this.amgId=source.amgId;
                this.sumId=source.sumId;
                this.orgId=source.orgId;
                this.userId=source.userId;
                this.tezId=source.tezId;
                this.ttzId=source.ttzId;
                this.typeId=source.typeId;
                this.firstname=source.firstname;
                this.lastname=source.lastname;
                this.color=source.color;
                this.imgId=source.imgId;
                this.pushNews=source.pushNews;
                this.pushSystem=source.pushSystem;
                this.pushWeb=source.pushWeb;
                this.pushEmail=source.pushEmail;
                this.fcmToken=source.fcmToken;
                this.setUseYn(source.getUseYn());
        }

        @Override
        public Profile createNewInstance() {
                Profile newInstance = new Profile();
                newInstance.update(this);
                return newInstance;
        }
}
