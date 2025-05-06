package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;

import java.util.List;

@Entity
public class Topic extends AbstractEntity {
    private String title;
    private String description;

    @ManyToMany(mappedBy = "topics")
    private List<Problem> problems;

    public Topic() {
    }

    public Topic(String title, String description, List<Problem> problems) {
        this.title = title;
        this.description = description;
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

    public List<Problem> getProblems() {
        return problems;
    }

    public void setProblems(List<Problem> problems) {
        this.problems = problems;
    }

    @Override
    public String toString() {
        return "Topic{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", problems=" + problems +
                '}';
    }
}
