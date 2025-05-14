import { UserDTO } from "./UserDTO";

export interface ClassroomDTO {
  id: number | null;
  name: string;
  descrition: string;
  enrollmentKey: string;
  teacher: UserDTO;
  students: UserDTO[];
}