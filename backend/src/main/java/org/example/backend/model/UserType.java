package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
public class UserType extends AbstractEntity{
    @NotBlank(message = "Name is required")
    private String type;

    @OneToMany(mappedBy = "type")
    private List<User> users = new ArrayList<>();

    public UserType() {
    }

    public UserType(String type, List<User> users) {
        this.type = type;
        this.users = users;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<User> getUsers() {
        return users;
    }

    @Override
    public String toString() {
        return "UserType{" +
                "type='" + type + '\'' +
                ", users=" + users +
                '}';
    }
}