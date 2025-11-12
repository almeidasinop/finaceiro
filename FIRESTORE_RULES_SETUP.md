# 🔥 Configuração Firebase Firestore Rules

## Como Aplicar as Regras no Firebase Console

### Opção 1: Via Firebase Console (Recomendado)

1. **Acesse o Firebase Console:**
   https://console.firebase.google.com/

2. **Selecione seu projeto:** `financeiro-ctr`

3. **Vá para Firestore Database:**
   - Clique em "Firestore Database" no menu lateral

4. **Vá para a aba "Rules":**
   - Clique na aba "Rules" no topo da página

5. **Substitua as regras atuais por estas:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cada usuário só pode acessar seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcoleções do usuário
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

6. **Clique em "Publish" (Publicar)**

### Opção 2: Via Firebase CLI

1. **Instale o Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login no Firebase:**
```bash
firebase login
```

3. **Inicialize o projeto (se ainda não foi feito):**
```bash
firebase init firestore
```

4. **Copie as regras para `firestore.rules`:**
```bash
cp firestore-permissive.rules firestore.rules
```

5. **Deploy as regras:**
```bash
firebase deploy --only firestore:rules
```

## 🔍 Verificação Após Aplicar as Regras

### Teste 1: Verificar se as regras foram aplicadas
```bash
firebase firestore:rules:get
```

### Teste 2: Testar conexão
```bash
node scripts/test-firestore-basic.cjs
```

### Teste 3: Testar com usuário autenticado
```bash
node scripts/test-firebase-connection.cjs
```

## 📋 Regras Recomendadas para Produção

Após confirmar que tudo está funcionando, você pode usar regras mais específicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /transactions/{transaction} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow create: if request.auth != null && 
          request.auth.uid == userId &&
          request.resource.data.keys().hasAll(['tipo', 'valor', 'descricao', 'data', 'categoria', 'conta']) &&
          request.resource.data.valor is number &&
          request.resource.data.valor > 0;
      }
      
      match /categories/{category} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /accounts/{account} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## ⚠️ Importante

- **Sempre teste as regras antes de colocar em produção**
- **Use regras específicas para cada tipo de operação**
- **Valide os dados que estão sendo salvos**
- **Monitore os logs de segurança no Firebase Console**