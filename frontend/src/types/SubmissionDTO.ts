import { ProblemDTO } from "./ProblemDTO";
import { UserDTO } from "./UserDTO";

export interface SubmissionDTO {
    id: number | null;
    code: string;
    language: string;
    report: string;
    score: number;
    submittedAt: string;
    user: UserDTO;
    problem: ProblemDTO;
}