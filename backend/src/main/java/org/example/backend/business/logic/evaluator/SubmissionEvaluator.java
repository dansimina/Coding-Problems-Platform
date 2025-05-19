package org.example.backend.business.logic.evaluator;

import org.example.backend.dto.TestCaseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SubmissionEvaluator {
    public EvaluationResult evaluate(String code, String language, List<TestCaseDTO> testCases) {
        Evaluator evaluator;
        return switch (language) {
            case "python" -> {
                evaluator = new PhytonEvaluator();
                yield evaluator.evaluate(code, testCases);
            }
            case "cpp" -> {
                evaluator = new CPPEvaluator();
                yield evaluator.evaluate(code, testCases);
            }
            default -> null;
        };
    }
}
