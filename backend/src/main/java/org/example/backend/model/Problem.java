package org.example.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Problem extends AbstractEntity {
    private String title;
    private String author;
    private String description;
    private String constraints;
    private String difficulty;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String officialSolution;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @OneToMany(mappedBy = "problem")
    private List<TestCase> tests;

    @ManyToMany
    private List<Topic> topics;

    @OneToMany(mappedBy = "problem")
    private List<Submission> submissions;

    public Problem() {
    }

    public Problem(String title, String author, String description, String constraints, String difficulty, String officialSolution, String image, List<TestCase> tests, List<Topic> topics, List<Submission> submissions) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.constraints = constraints;
        this.difficulty = difficulty;
        this.officialSolution = officialSolution;
        this.image = image;
        this.tests = tests;
        this.topics = topics;
        this.submissions = submissions;
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

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getOfficialSolution() {
        return officialSolution;
    }

    public void setOfficialSolution(String officialSolution) {
        this.officialSolution = officialSolution;
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

    public List<Submission> getSolutions() {
        return submissions;
    }

    public void setSolutions(List<Submission> submissions) {
        this.submissions = submissions;
    }

    @Override
    public String toString() {
        return "Problem{" +
                "title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", description='" + description + '\'' +
                ", constraints='" + constraints + '\'' +
                ", difficulty='" + difficulty + '\'' +
                ", officialSolution='" + officialSolution + '\'' +
                ", image='" + image + '\'' +
                ", tests=" + tests +
                ", topics=" + topics +
                ", solutions=" + submissions +
                '}';
    }
}
