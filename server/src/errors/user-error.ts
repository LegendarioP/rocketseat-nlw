export class UserAlreadyExistsError extends Error {
    constructor(message = "Usuário já existe com esse e-mail") {
        super(message);
        this.name = "UserAlreadyExistsError";
    }
}