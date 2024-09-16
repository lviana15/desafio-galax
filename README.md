Garantir que tenha instalado NodeJS e MongoDB esteja rodando.
Para configuração do mongoDB no backend da aplicação temos arquivo .env na raíz do projeto backend

```
cd backend
```

criar arquivo .env seguindo exemplo:
```
MONGO_URI=mongodb://<host>:<porta-do-banco>/<nome-do-banco>
```

Executar aplicação backend com comando
```
nest start
```

---

Para configuração da API no frontend temos arquivo .env na raíz do projeto frontend
```
cd frontend
```
criar arquivo .env seguindo exemplo:
```
VITE_API_URL=http://<host>:<porta-do-backend>
```

Executar aplicação backend com comando
```
npm run dev
```


