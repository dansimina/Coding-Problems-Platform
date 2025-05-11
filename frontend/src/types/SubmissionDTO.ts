import { ProblemDTO } from "./ProblemDTO";
import { UserDTO } from "./UserDTO";

export interface SubmissionDTO {
    code: string;
    language: string;
    report: string;
    score: number;
    submittedAt: string;
    user: UserDTO;
    problem: ProblemDTO;
}