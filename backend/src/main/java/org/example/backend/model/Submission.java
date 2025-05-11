package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class Submission extends AbstractEntity {
    String code;
    String language;
    String report;
    Integer score;

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

    @Override
    public String toString() {
        return "Submission{" +
                "code='" + code + '\'' +
                ", language='" + language + '\'' +
                ", report='" + report + '\'' +
                ", score=" + score +
                ", user=" + user +
                ", problem=" + problem +
                '}';
    }
}
