package org.example.backend.business.logic.evaluator;

import org.example.backend.dto.TestCaseDTO;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class PhytonEvaluator extends Evaluator {
    @Override
    public EvaluationResult evaluate(String code, List<TestCaseDTO> testCases) {
        try {
            Path tempFile = Files.createTempFile("python_eval_", ".py");
            Files.write(tempFile, code.getBytes());

            int index = 0;
            int passed = 0;
            StringBuilder report = new StringBuilder();

            for (TestCaseDTO testCase : testCases) {
                Process runProcess = new ProcessBuilder("python", tempFile.toString())
                        .start();

                // Provide input
                try (PrintWriter writer = new PrintWriter(runProcess.getOutputStream())) {
                    writer.println(testCase.input());
                    writer.flush();
                }

                boolean finished = runProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
                if (!finished) {
                    runProcess.destroyForcibly();
                    return new EvaluationResult(false, "Time limit exceeded", null, null);
                }

                String output = readStream(runProcess.getInputStream()).trim();
                String expectedOutput = testCase.output().trim();

                if (!output.equals(expectedOutput)) {
                    report.append("Test case ").append(index).append(": failed\n");
                }
                else {
                    report.append("Test case ").append(index).append(": pass\n");
                    passed++;
                }

                index++;
            }

            report.append("Test case count: ").append(passed).append("/").append(testCases.size()).append("\n");

            Files.deleteIfExists(tempFile);
            return new EvaluationResult(true, report.toString(), testCases.size(), passed);

        } catch (Exception e) {
            return new EvaluationResult(false, "Error: " + e.getMessage(), null, null);
        }
    }

    private String readStream(InputStream stream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }
}
