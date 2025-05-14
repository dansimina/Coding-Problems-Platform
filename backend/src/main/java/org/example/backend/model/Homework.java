package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Homework extends AbstractEntity {
    private String title;
    private String description;
    private LocalDateTime deadline;

    @ManyToOne
    private Classroom classroom;

    @ManyToMany(mappedBy = "homeworks")
    private List<Problem> problems;

    public Homework() {
    }

    public Homework(String title, String description, LocalDateTime deadline, Classroom classroom, List<Problem> problems) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.classroom = classroom;
        this.problems = problems;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Classroom getClassroom() {
        return classroom;
    }

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    public List<Problem> getProblems() {
        return problems;
    }

    public void setProblems(List<Problem> problems) {
        this.problems = problems;
    }

    @Override
    public String toString() {
        return "Homework{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", deadline=" + deadline +
                ", classroom=" + classroom +
                ", problems=" + problems +
                '}';
    }
}
