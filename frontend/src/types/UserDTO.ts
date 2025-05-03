export interface UserDTO {
    id: number | null;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    type: "admin" | "teacher" | "student";

}