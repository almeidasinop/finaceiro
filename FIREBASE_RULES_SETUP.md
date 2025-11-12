# Firebase CLI Commands

Para aplicar as regras do Firestore, você precisa usar o Firebase CLI:

## Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

## Login no Firebase
```bash
firebase login
```

## Aplicar Regras
```bash
firebase deploy --only firestore:rules
```

## Verificar Status
```bash
firebase firestore:rules:history
```

## Comandos Úteis
```bash
# Ver regras atuais
firebase firestore:rules:get

# Testar regras
firebase firestore:rules:simulate
```

## Nota Importante
As regras precisam ser aplicadas via Firebase CLI para terem efeito no servidor.
Apenas criar o arquivo firestore.rules não é suficiente.