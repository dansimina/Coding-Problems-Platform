import { ClassroomDTO } from "./ClassroomDTO";
import { HomeworkDTO } from "./HomeworkDTO";

export interface NewHomeworkDTO {
    classroomDTO: ClassroomDTO;
    homeworkDTO: HomeworkDTO;
}