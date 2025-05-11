package org.example.backend.business.logic.evaluator;

public record EvaluationResult(Boolean success, String report, Integer noOfTests, Integer noOfPassed) {
}
