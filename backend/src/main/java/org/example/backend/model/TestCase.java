package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class TestCase extends AbstractEntity {
    private String input;
    private String output;
    private Boolean example;

    @ManyToOne
    private Problem problem;

    public TestCase() {
    }

    public TestCase(String input, String output, Boolean example, Problem problem) {
        this.input = input;
        this.output = output;
        this.example = example;
        this.problem = problem;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public Boolean getExample() {
        return example;
    }

    public void setExample(Boolean example) {
        this.example = example;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    @Override
    public String toString() {
        return "TestCase{" +
                "input='" + input + '\'' +
                ", output='" + output + '\'' +
                ", example=" + example +
                ", problem=" + problem +
                '}';
    }
}
