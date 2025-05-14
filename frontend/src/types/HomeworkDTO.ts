import { ProblemDTO } from "./ProblemDTO";

export interface HomeworkDTO {
  id: number | null;
  title: string;
  description: string;
  deadline: string;
  problems: ProblemDTO[];
}
