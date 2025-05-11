package org.example.backend.business.logic.evaluator;

import org.example.backend.dto.TestCaseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SubmissionEvaluator {
    public EvaluationResult evaluate(String code, String language, List<TestCaseDTO> testCases) {
        switch (language) {
            case "python":
                Evaluator evaluator = new PhytonEvaluator();
                return evaluator.evaluate(code, testCases);
            default:
                return null;
        }
    }
}
