import { ProblemDTO } from "./ProblemDTO";
import { UserDTO } from "./UserDTO";

export interface SubmissionDTO {
    code: string;
    language: string;
    report: string;
    score: number;
    user: UserDTO;
    problem: ProblemDTO;
}