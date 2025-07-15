import request from 'supertest';
import { app } from '../app';
import { MemoriesServices } from '../services/memories.service';
import { memoriesService } from '../controllers/memories.controller';


beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});


describe('Memories public routes', () => {
  let createdId: string;
  const sub = 'f2ad5db1-1d13-4c99-a695-c3b9aa3d1e38';


  it('POST /memories/create deve retornar 401 se não autenticado', async () => {
    const res = await request(app.server)
      .post('/memories/create')
      .send({
        content: 'Memória sem auth',
        coverUrl: 'http://example.com/img.png',
        isPublic: true
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  it('POST /memories/create deve retornar 400 se dados inválidos', async () => {
    const token = app.jwt ? app.jwt.sign({ sub: 'test-user-id' }) : '';
    // Enviando dados inválidos (faltando content)
    const res = await request(app.server)
      .post('/memories/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        coverUrl: 'http://example.com/img.png',
        isPublic: true
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid data');
  });

  it('GET /memories deve retornar 401 se não autenticado', async () => {
    const res = await request(app.server).get('/memories');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  // Exemplo de mock para simular erro customizado (CreateMemoryError)
  it('POST /memories/create deve retornar 422 se ocorrer erro de criação', async () => {
    // Mocka o método create do service para lançar CreateMemoryError
    const { CreateMemoryError } = require('../errors/memorie-error');
    const originalCreate = memoriesService.create;
    memoriesService.create = async () => { throw new CreateMemoryError(); };
    const token = app.jwt ? app.jwt.sign({ sub: 'test-user-id' }) : '';
    const res = await request(app.server)
      .post('/memories/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Teste erro criação',
        coverUrl: 'http://example.com/img.png',
        isPublic: true
      });
    expect(res.status).toBe(422);
    memoriesService.create = originalCreate;
  });

  it('GET /memories/public deve retornar 200', async () => {
    const res = await request(app.server).get('/memories/public');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });


  it('POST /memories/create deve criar uma memória pública', async () => {
    // Simula um usuário autenticado (ajuste conforme seu auth real)
    const token = app.jwt ? app.jwt.sign({ sub: sub }) : '';
    const res = await request(app.server)
      .post('/memories/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Memória pública de teste',
        coverUrl: 'http://example.com/img.png',
        isPublic: true
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('GET /memories/:id deve retornar a memória criada', async () => {
    // Simula um usuário autenticado
    const token = app.jwt ? app.jwt.sign({ sub: sub }) : '';
    const res = await request(app.server)
      .get(`/memories/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('PUT /memories/:id deve atualizar a memória', async () => {
    const token = app.jwt ? app.jwt.sign({ sub: sub }) : '';
    const res = await request(app.server)
      .put(`/memories/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Memória atualizada',
        isPublic: false
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('content', 'Memória atualizada');
  });

  it('DELETE /memories/:id deve remover a memória', async () => {
    const token = app.jwt ? app.jwt.sign({ sub: sub }) : '';
    const res = await request(app.server)
      .delete(`/memories/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });

  it('GET /memories/:id deve retornar 404 para memória inexistente', async () => {
    const token = app.jwt ? app.jwt.sign({ sub: sub }) : '';
    const res = await request(app.server)
      .get(`/memories/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});