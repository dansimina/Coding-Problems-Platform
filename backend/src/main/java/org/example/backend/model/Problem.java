package org.example.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Problem extends AbstractEntity {
    private String title;
    private String author;
    private String description;
    private String constraints;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @OneToMany(mappedBy = "problem")
    private List<TestCase> tests;

    @ManyToMany
    private List<Topic> topics;

    public Problem() {
    }

    public Problem(String title, String author, String description, String constraints, String image, List<TestCase> tests, List<Topic> topics) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.constraints = constraints;
        this.image = image;
        this.tests = tests;
        this.topics = topics;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getConstraints() {
        return constraints;
    }

    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<TestCase> getTests() {
        return tests;
    }

    public void setTests(List<TestCase> tests) {
        this.tests = tests;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    @Override
    public String toString() {
        return "Problem{" +
                "title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", description='" + description + '\'' +
                ", constraints='" + constraints + '\'' +
                ", image='" + image + '\'' +
                ", tests=" + tests +
                ", topics=" + topics +
                '}';
    }
}
