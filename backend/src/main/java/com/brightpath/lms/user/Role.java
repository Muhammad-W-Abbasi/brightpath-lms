package com.brightpath.lms.user;

import jakarta.persistence.*;

@Entity
@Table(name = "ROLES")
public class Role {

    @Id
    private Long id;

    @Column(name = "NAME")
    private String name;

    public String getName() { return name; }
}
