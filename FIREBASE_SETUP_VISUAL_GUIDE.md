# 🔧 GUIA RÁPIDO: Configurar Firebase Console

## Problema Identificado
Seus dados não estão aparecendo no Firebase porque:

1. ❌ **Email/Password Authentication NÃO está habilitado**
2. ❌ **Regras do Firestore estão negando acesso**

## 🎯 Solução Imediata

### PASSO 1: Habilitar Email/Password Authentication

1. **Acesse:** https://console.firebase.google.com/
2. **Clique no projeto:** `financeiro-ctr`
3. **No menu lateral, clique:** "Authentication"
4. **Clique na aba:** "Sign-in method" (métodos de login)
5. **Encontre:** "Email/Password" na lista
6. **Clique no lápis ✏️** (editar)
7. **Ative:** "Enable" (habilitar)
8. **Clique:** "Save" (salvar)

### PASSO 2: Configurar Regras do Firestore

1. **No menu lateral, clique:** "Firestore Database"
2. **Clique na aba:** "Rules" (regras)
3. **Substitua TODO o conteúdo por:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

4. **Clique:** "Publish" (publicar)
5. **Confirme:** "Publish" novamente

### PASSO 3: Testar

1. **Volte para o seu site:** http://localhost:5174/
2. **Faça login com:** `admin@example.com` / `Admin123!`
3. **Adicione uma categoria ou transação**
4. **Verifique no Firebase Console:**
   - Vá para "Firestore Database" > "Data"
   - Você deve ver a pasta "users" com os dados do usuário

## 📱 Visualização da Estrutura

Após configurar corretamente, você verá no Firebase:

```
users/
└── {userId}/
    ├── categories/
    │   └── {categoriaId}
    ├── transactions/
    │   └── {transacaoId}
    ├── accounts/
    │   └── {contaId}
    └── subscriptions/
        └── {assinaturaId}
```

## ⚡ Teste Rápido

Depois de configurar, rode este comando para testar:
```bash
node scripts/diagnose-firebase.cjs
```

**Resultado esperado:** ✅ Todos os testes passando

## 🚨 Se Ainda Não Funcionar

1. **Verifique se o usuário está logado no site**
2. **Abra o Console do Navegador (F12)** e veja se há erros
3. **Verifique se as regras foram realmente publicadas** (deve mostrar "Active" no Firebase)
4. **Tente fazer logout e login novamente**

## 📞 Suporte

Se precisar de ajuda adicional:
- Verifique o Console do Navegador (F12) para erros
- Execute: `node scripts/diagnose-firebase.cjs` e me envie o resultado
- Verifique se os usuários de teste foram criados: `npm run create-test-users`