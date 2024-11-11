import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('Get /users should return 401 if token is invalid', async () => {
    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer invalid-token');
    expect(req.status).toBe(401);
    expect(req.body.message).toBe('Expired Token');
  });

  it('Get /users should return 401 if no token is provided', async () => {
    const req = await request(app.getHttpServer()).get('/users');
    expect(req.status).toBe(401);
    expect(req.body.message).toBe('Token not found');
  });

  it('Get /users Return an array of users with an OK status code if token is provided', async () => {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const token = jwtService.sign({
      userId: '7be97fc4-3b87-4a2f-bad1-2b696f43728b',
      roles: ['admin'],
    });

    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    console.log(req.body);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });
  it('Get /users should return 403 if user does not have the required role', async () => {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const token = jwtService.sign({
      userId: '0cb627bf-1b23-4c5e-b5fe-86638b32255f',
      roles: ['User'],
    });

    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(403);
    expect(req.body.message).toBe(
      'You do not have permission and are not allowed to access this route',
    );
  });

  it('Get /users should return 200 if user has the correct role', async () => {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const token = jwtService.sign({
      userId: '0cb627bf-1b23-4c5e-b5fe-86638b32255f',
      roles: ['admin'],
    });

    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Get /users/:id returns an user with an OK status code', async () => {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const token = jwtService.sign({
      userId: '7be97fc4-3b87-4a2f-bad1-2b696f43728b',
      roles: ['admin'],
    });

    const req = await request(app.getHttpServer())
      .get('/users/7be97fc4-3b87-4a2f-bad1-2b696f43728b')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it("Get /users/:id throws a NotFoundException if the user doesn't exist with a message User Not Found", async () => {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const token = jwtService.sign({
      userId: '7be97fc4-3b87-4a2f-bad1-2b696f43728b',
      roles: ['admin'],
    });

    const req = await request(app.getHttpServer())
      .get('/users/7be97fc4-3b67-4a2f-bad1-2b696f43728b')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(404);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('PUT /users/:id updates user data and returns 200 status code', async () => {
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const token = jwtService.sign({
      userId: '7be97fc4-3b87-4a2f-bad1-2b696f43728b',
      roles: ['admin'],
    });

    const updateUser = {
      name: 'Updat2ed User',
      email: 'updateduser@example.com',
    };

    const req = await request(app.getHttpServer())
      .put('/users/7be97fc4-3b87-4a2f-bad1-2b696f43728b')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(200);
    expect(req.body.name).toBe('Updated User');
  });
  
});
