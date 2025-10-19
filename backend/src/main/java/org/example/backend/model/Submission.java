package org.example.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "app_submission")
public class Submission extends AbstractEntity {
    @Lob
    @Column(columnDefinition = "TEXT")
    String code;

    String language;
    Integer score;

    @Lob
    @Column(columnDefinition = "TEXT")
    String report;

    LocalDateTime submittedAt;
    @PrePersist
    public void prePersist() {
        submittedAt = LocalDateTime.now();
    }

    @ManyToOne
    User user;

    @ManyToOne
    Problem problem;

    public Submission() {
    }

    public Submission(String code, String language, String report, Integer score, User user, Problem problem) {
        this.code = code;
        this.language = language;
        this.report = report;
        this.score = score;
        this.user = user;
        this.problem = problem;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    @Override
    public String toString() {
        return "Submission{" +
                "code='" + code + '\'' +
                ", language='" + language + '\'' +
                ", report='" + report + '\'' +
                ", score=" + score +
                ", submittedAt=" + submittedAt +
                ", user=" + user +
                ", problem=" + problem +
                '}';
    }
}
