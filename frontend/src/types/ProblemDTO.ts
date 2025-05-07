import { TestCaseDTO } from "./TestCaseDTO";
import { TopicDTO } from "./TopicDTO";

export interface ProblemDTO {
    id: number | null;
    title: string;
    author: string;
    description: string;
    constraints: string;
    difficulty: "easy" | "medium" | "hard";
    officialSolution: string | null;
    image: string | null;
    tests: TestCaseDTO[];
    topics: TopicDTO[];
}