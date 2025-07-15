export class CreateMemoryError extends Error {
    constructor(message = "Erro ao criar memória") {
        super(message);
        this.name = "CreateMemoryError";
    }
}