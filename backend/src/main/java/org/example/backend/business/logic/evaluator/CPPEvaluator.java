package org.example.backend.business.logic.evaluator;

import org.example.backend.dto.TestCaseDTO;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class CPPEvaluator extends Evaluator {
    @Override
    public EvaluationResult evaluate(String code, List<TestCaseDTO> testCases) {
        Path tempCppFile = null;
        Path executableFile = null;

        try {
            tempCppFile = Files.createTempFile("cpp_eval_", ".cpp");
            Files.write(tempCppFile, code.getBytes());

            String execExtension = System.getProperty("os.name").toLowerCase().contains("win") ? ".exe" : "";
            executableFile = Files.createTempFile("cpp_exec_", execExtension);
            Files.deleteIfExists(executableFile); // Delete the file so compiler can create it

            // Compile the C++ file
            ProcessBuilder compileBuilder = new ProcessBuilder("g++", tempCppFile.toString(), "-o", executableFile.toString());
            Process compileProcess = compileBuilder.start();

            // Capture compilation errors
            String compileError = readStream(compileProcess.getErrorStream());

            boolean compileFinished = compileProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!compileFinished) {
                compileProcess.destroyForcibly();
                return new EvaluationResult(false, "Compilation time limit exceeded", null, null);
            }

            if (compileProcess.exitValue() != 0) {
                return new EvaluationResult(false, "Compilation error: " + compileError, null, null);
            }

            // Make the file executable on Unix-like systems
            if (!System.getProperty("os.name").toLowerCase().contains("win")) {
                executableFile.toFile().setExecutable(true);
            }

            int index = 0;
            int passed = 0;
            StringBuilder report = new StringBuilder();

            for (TestCaseDTO testCase : testCases) {
                Process runProcess = new ProcessBuilder(executableFile.toString())
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

            return new EvaluationResult(true, report.toString(), testCases.size(), passed);

        } catch (Exception e) {
            return new EvaluationResult(false, "Error: " + e.getMessage(), null, null);
        } finally {
            // Clean up temporary files
            try {
                if (tempCppFile != null) Files.deleteIfExists(tempCppFile);
                if (executableFile != null) Files.deleteIfExists(executableFile);
            } catch (IOException e) {
                // Log cleanup error but don't affect result
                System.err.println("Error cleaning up temporary files: " + e.getMessage());
            }
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