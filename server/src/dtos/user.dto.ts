export interface CreateUserDTO {
    githubId?:  number;
    name:       string;
    email:      string;
    password:   string;
    color?:     string;
    avatarUrl?: string;
}