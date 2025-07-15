export class CreateMemoryError extends Error {
    constructor(message = "Erro ao criar memória") {
        super(message);
        this.name = "CreateMemoryError";
    }
}

export class MemoryNotFoundError extends Error {
    constructor(message = "Memória não encontrada") {
        super(message);
        this.name = "MemoryNotFoundError";
    }
}