package org.example.backend.business.logic.evaluator;

import org.example.backend.dto.TestCaseDTO;

import java.util.List;

public abstract class Evaluator {
    protected static final int TIMEOUT_SECONDS = 5;
    protected final String TEMP_DIR = System.getProperty("java.io.tmpdir");

    public abstract EvaluationResult evaluate(String code, List<TestCaseDTO> testCaseDTO);
}
