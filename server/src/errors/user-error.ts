export class UserAlreadyExistsError extends Error {
    constructor(message = "Usuário já existe com esse e-mail") {
        super(message);
        this.name = "UserAlreadyExistsError";
    }
}

export class UserNotFoundError extends Error { 
    constructor(message = "Usuário não encontrado") {
        super(message);
        this.name = "UserNotFound";
    }
}