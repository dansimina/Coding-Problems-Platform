import { SubmissionDTO } from "./SubmissionDTO";
import { UserDTO } from "./UserDTO";

export interface HomeworkStatusDTO {
    user: UserDTO;
    submissions: SubmissionDTO[];
    totalScore: number;
}
