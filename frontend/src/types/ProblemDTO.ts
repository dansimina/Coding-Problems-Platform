import { TestCaseDTO } from "./TestCaseDTO";
import { TopicDTO } from "./TopicDTO";

export interface ProblemDTO {
    title: string;
    author: string;
    description: string;
    constraints: string;
    image: string | null;
    tests: TestCaseDTO[];
    topics: TopicDTO[];
}