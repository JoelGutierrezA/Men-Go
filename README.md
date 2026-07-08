# Men-Go

Repositorio del proyecto **MenúGo**, una plataforma SaaS para restaurantes,
bares, pubs y cafeterías orientada a la creación y administración de menús
digitales con códigos QR.

## Estructura base

- `backend/`: API NestJS con arquitectura modular, `ConfigModule`, CORS,
  `ValidationPipe`, JWT base y `CloudinaryModule` preparado.
- `frontend/`: aplicación Angular 21 con Angular Material, routing, layout
  administrativo, landing temporal, login temporal y dashboard temporal.

## Requisitos locales

- Backend: Node `20+`
- Frontend: Node `20.19.0+`

## Comandos

Backend:

```bash
cd backend
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```
