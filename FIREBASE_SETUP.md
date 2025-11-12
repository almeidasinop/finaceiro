# Configuração Firebase Firestore Rules

## Passo 1: Acessar Firebase Console
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto "financeiro-ctr"

## Passo 2: Configurar Firestore Rules
1. No menu lateral, clique em "Firestore Database"
2. Vá para a aba "Rules"
3. Substitua as regras existentes pelas regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para categorias - permitir leitura e escrita para usuários autenticados
    match /categories/{category} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.resource.data.keys().hasAll(['name', 'type', 'icon', 'color'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 50
        && request.resource.data.type in ['receita', 'despesa']
        && request.resource.data.icon is string
        && request.resource.data.color is string
        && request.resource.data.color.matches('^#[0-9A-F]{6}$');
      allow update: if request.auth != null
        && request.resource.data.keys().hasAll(['name', 'type', 'icon', 'color'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 50
        && request.resource.data.type in ['receita', 'despesa']
        && request.resource.data.icon is string
        && request.resource.data.color is string
        && request.resource.data.color.matches('^#[0-9A-F]{6}$');
      allow delete: if request.auth != null;
    }
    
    // Regras para transações - permitir leitura e escrita para usuários autenticados
    match /transactions/{transaction} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.keys().hasAll(['tipo', 'valor', 'descricao', 'data', 'categoria', 'conta'])
        && request.resource.data.tipo in ['Receita', 'Despesa']
        && request.resource.data.valor is number
        && request.resource.data.valor > 0
        && request.resource.data.descricao is string
        && request.resource.data.data is string
        && request.resource.data.categoria is string
        && request.resource.data.conta is string;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Regras para contas - permitir leitura e escrita para usuários autenticados
    match /accounts/{account} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.keys().hasAll(['name', 'type'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.type in ['corrente', 'poupanca', 'investimento', 'carteira']
        && (!request.resource.data.keys().hasAny(['balance']) || request.resource.data.balance == null || request.resource.data.balance is number);
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Regras para assinaturas - permitir leitura e escrita para usuários autenticados
    match /subscriptions/{subscription} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.keys().hasAll(['name', 'amount', 'frequency', 'dueDay', 'category'])
        && request.resource.data.name is string
        && request.resource.data.amount is number
        && request.resource.data.amount > 0
        && request.resource.data.frequency in ['mensal', 'trimestral', 'semestral', 'anual']
        && request.resource.data.dueDay is number
        && request.resource.data.dueDay >= 1
        && request.resource.data.dueDay <= 31
        && request.resource.data.category is string;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

4. Clique em "Publicar"

## Passo 3: Configurar Autenticação (Opcional para testes)
Se quiser permitir acesso sem autenticação apenas para testes, use estas regras temporárias:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso total para testes (NÃO use em produção)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Importante**: As regras de teste acima permitem acesso total e devem ser usadas apenas para desenvolvimento. Em produção, sempre use autenticação adequada.

## Passo 4: Verificar a Aplicação
Após configurar as regras:
1. Recarregue a página da aplicação
2. Tente adicionar uma nova categoria
3. O sistema deve funcionar sem erros de permissão

## Solução Atual Implementada
O sistema agora possui:
- ✅ Fallback automático para LocalStorage quando Firebase não tem permissão
- ✅ Mensagem visual indicando modo offline
- ✅ Funcionalidade completa mesmo sem Firebase
- ✅ Código preparado para quando as permissões forem configuradas

O botão de adicionar categoria agora deve funcionar normalmente!