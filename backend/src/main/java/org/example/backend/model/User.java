package org.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class User extends AbstractEntity {
    @NotBlank(message = "Userame is required!")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Firstname is required!")
    @Size(min = 1, max = 50, message = "Name must be between 1 and 50 characters")
    private String firstName;

    @NotBlank(message = "Lastname is required!")
    @Size(min = 1, max = 50, message = "Name must be between 1 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required!")
    @Size(min = 1, max = 50, message = "Email must be between 1 and 50 characters")
    private String email;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    @ManyToOne
    private UserType type;

    public User() {
    }

    public User(String username, String password, String firstName, String lastName, String email, String profilePicture, UserType type) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.profilePicture = profilePicture;
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public UserType getType() {
        return type;
    }

    public void setType(UserType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", type=" + type +
                '}';
    }
}
