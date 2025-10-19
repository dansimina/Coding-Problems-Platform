package org.example.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "app_classroom")
public class Classroom extends AbstractEntity {
    private String name;
    private String description;
    private String enrollmentKey;

    @ManyToOne
    private User teacher;

    @ManyToMany
    private List<User> students;

    @OneToMany(mappedBy = "classroom")
    private List<Homework> homeworks;

    public Classroom() {
    }

    public Classroom(String name, String description, String enrollmentKey, User teacher, List<User> students, List<Homework> homeworks) {
        this.name = name;
        this.description = description;
        this.enrollmentKey = enrollmentKey;
        this.teacher = teacher;
        this.students = students;
        this.homeworks = homeworks;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEnrollmentKey() {
        return enrollmentKey;
    }

    public void setEnrollmentKey(String enrollmentKey) {
        this.enrollmentKey = enrollmentKey;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public List<User> getStudents() {
        return students;
    }

    public void setStudents(List<User> students) {
        this.students = students;
    }

    public List<Homework> getHomeworks() {
        return homeworks;
    }

    public void setHomeworks(List<Homework> homeworks) {
        this.homeworks = homeworks;
    }

    @Override
    public String toString() {
        return "Classroom{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", enrollmentKey='" + enrollmentKey + '\'' +
                ", teacher=" + teacher +
                ", students=" + students +
                ", homeworks=" + homeworks +
                '}';
    }
}
