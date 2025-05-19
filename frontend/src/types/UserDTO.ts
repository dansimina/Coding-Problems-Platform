export interface UserDTO {
    id: number | null;
    username: string;
    password: string | null;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    type: "admin" | "teacher" | "student";

}