import { UserDTO } from "./UserDTO";

export interface ClassroomDTO {
  id: number | null;
  name: string;
  description: string;
  enrollmentKey: string;
  teacher: UserDTO;
  students: UserDTO[];
}