const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit } = require('firebase/firestore');
require('dotenv').config();

// Configuração do Firebase
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

async function testFirestoreAccess() {
  console.log('🧪 Testando acesso ao Firestore...\n');
  
  try {
    // Tentar acessar uma coleção pública (se existir)
    console.log('1. Testando acesso ao Firestore...');
    
    // Tentar listar documentos em uma coleção
    const querySnapshot = await getDocs(collection(db, 'test-public'));
    console.log(`✅ Acesso ao Firestore funcionando! Encontrados ${querySnapshot.size} documentos`);
    
  } catch (error) {
    console.error('\n❌ Erro ao acessar Firestore:', error.code, '-', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 Permissão negada. Verificando configurações...');
      console.log('Possíveis causas:');
      console.log('- As regras de segurança do Firestore estão muito restritivas');
      console.log('- O usuário não está autenticado corretamente');
      console.log('- As credenciais do Firebase podem estar incorretas');
    } else if (error.code === 'not-found') {
      console.log('\n📝 A coleção não existe (isso é normal)');
    } else {
      console.log('\n🔧 Outro tipo de erro:', error);
    }
  }
  
  // Testar se o app foi inicializado corretamente
  console.log('\n2. Verificando configuração do Firebase:');
  console.log('✅ Firebase App inicializado:', app.name);
  console.log('✅ Project ID:', firebaseConfig.projectId);
  console.log('✅ Auth Domain:', firebaseConfig.authDomain);
  
  console.log('\n💡 Dicas para resolver problemas:');
  console.log('1. Verifique se o Email/Password Authentication está habilitado no Firebase Console');
  console.log('2. Verifique se as regras do Firestore estão configuradas corretamente');
  console.log('3. Teste as credenciais no Firebase Console > Authentication > Users');
  
  process.exit(0);
}

if (require.main === module) {
  testFirestoreAccess().catch(console.error);
}