// Script para verificar se as regras do Firestore estão corretas
// e se o Email/Password Authentication está habilitado

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, serverTimestamp } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function diagnoseFirebaseIssues() {
  console.log('🔍 Diagnóstico Completo do Firebase\n');
  
  // 1. Verificar configuração
  console.log('1. Verificando configuração:');
  console.log('   ✅ Project ID:', firebaseConfig.projectId);
  console.log('   ✅ Auth Domain:', firebaseConfig.authDomain);
  console.log('   ✅ API Key:', firebaseConfig.apiKey ? 'Presente' : '❌ Ausente');
  
  // 2. Testar autenticação
  console.log('\n2. Testando autenticação:');
  try {
    // Testar login com usuário existente
    await signInWithEmailAndPassword(auth, 'admin@example.com', 'Admin123!');
    console.log('   ✅ Login com email/senha funcionando');
  } catch (error) {
    console.log('   ❌ Erro de autenticação:', error.code);
    console.log('   📝 Mensagem:', error.message);
    
    if (error.code === 'auth/invalid-credential') {
      console.log('   💡 Possível causa: Email/Password Auth não está habilitado no Firebase Console');
      console.log('   🔧 Solução: Vá para Firebase Console > Authentication > Sign-in method');
      console.log('   🔧 Habilite "Email/Password" e clique em "Save"');
    }
  }
  
  // 3. Testar Firestore com regras públicas
  console.log('\n3. Testando Firestore (tentando acesso público):');
  try {
    // Tentar acessar uma coleção que deveria ser pública
    const querySnapshot = await getDocs(collection(db, 'test-public'));
    console.log('   ✅ Firestore acessível (coleção pública)');
  } catch (error) {
    console.log('   ❌ Erro no Firestore:', error.code);
    console.log('   📝 Mensagem:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('   💡 Possível causa: Regras do Firestore muito restritivas');
      console.log('   🔧 Solução: Atualize as regras no Firebase Console > Firestore > Rules');
    }
  }
  
  // 4. Testar criação de documento com usuário autenticado
  console.log('\n4. Testando criação de documento com usuário autenticado:');
  try {
    const user = auth.currentUser;
    if (user) {
      console.log('   ✅ Usuário autenticado:', user.email, '(UID:', user.uid + ')');
      
      // Tentar criar um documento na coleção do usuário
      const userDocRef = await addDoc(collection(db, 'users', user.uid, 'test'), {
        message: 'Teste de criação de documento',
        timestamp: serverTimestamp(),
        test: true
      });
      
      console.log('   ✅ Documento criado com sucesso:', userDocRef.id);
      
      // Listar documentos
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'test'));
      console.log('   ✅ Documentos encontrados:', querySnapshot.size);
      
    } else {
      console.log('   ❌ Nenhum usuário autenticado');
    }
  } catch (error) {
    console.log('   ❌ Erro ao criar documento:', error.code);
    console.log('   📝 Mensagem:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('   💡 Possível causa: Regras não permitem escrita para este usuário');
      console.log('   🔧 Solução: Verifique as regras no Firebase Console');
    }
  }
  
  // 5. Verificar estrutura de dados
  console.log('\n5. Verificando estrutura de dados esperada:');
  console.log('   📁 Estrutura: users/{userId}/{collections}');
  console.log('   📁 Coleções: transactions, categories, accounts, subscriptions');
  console.log('   🔐 Regra: request.auth.uid == userId');
  
  console.log('\n📋 RESUMO DOS PROBLEMAS E SOLUÇÕES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('\n🔧 PASSO A PASSO PARA CORRIGIR:');
  console.log('1. Acesse: https://console.firebase.google.com/');
  console.log('2. Selecione o projeto: financeiro-ctr');
  console.log('3. Vá para: Authentication > Sign-in method');
  console.log('4. Habilitar: Email/Password (clique em Enable e Save)');
  console.log('5. Vá para: Firestore Database > Rules');
  console.log('6. Substitua as regras pelas regras seguras fornecidas');
  console.log('7. Clique em: Publish');
  
  console.log('\n📄 Regras Seguras para usar:');
  console.log('```javascript');
  console.log('rules_version = \'2\';');
  console.log('service cloud.firestore {');
  console.log('  match /databases/{database}/documents {');
  console.log('    match /users/{userId} {');
  console.log('      allow read, write: if request.auth != null && request.auth.uid == userId;');
  console.log('      match /{subcollection=**} {');
  console.log('        allow read, write: if request.auth != null && request.auth.uid == userId;');
  console.log('      }');
  console.log('    }');
  console.log('  }');
  console.log('}');
  console.log('```');
  
  process.exit(0);
}

if (require.main === module) {
  diagnoseFirebaseIssues().catch(console.error);
}