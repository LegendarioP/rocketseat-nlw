export interface CreateUserDTO {
    githubId?:  number;
    name:       string;
    email:      string;
    password:   string;
    color?:     string;
    avatarUrl?: string;
}

export interface UpdateUserDTO {
    githubId?:  number;
    name?:       string;
    email?:      string;
    password?:   string;
    color?:     string;
    avatarUrl?: string;
}