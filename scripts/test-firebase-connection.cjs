const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
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
const auth = getAuth(app);

async function testFirebaseConnection() {
  console.log('🧪 Testando conexão com Firebase...\n');
  
  try {
    // Testar autenticação
    console.log('1. Testando autenticação...');
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@example.com', 'Admin123!');
    console.log(`✅ Autenticado com sucesso: ${userCredential.user.email} (UID: ${userCredential.user.uid})`);
    
    // Testar criação de documento
    console.log('\n2. Testando criação de documento...');
    const userId = userCredential.user.uid;
    const testDoc = await addDoc(collection(db, 'users', userId, 'test'), {
      message: 'Teste de conexão Firebase',
      timestamp: new Date(),
      userId: userId
    });
    console.log(`✅ Documento criado com sucesso: ${testDoc.id}`);
    
    // Testar leitura de documentos
    console.log('\n3. Testando leitura de documentos...');
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'test'));
    console.log(`✅ Encontrados ${querySnapshot.size} documentos na coleção test`);
    
    querySnapshot.forEach((doc) => {
      console.log(`   - Documento ${doc.id}: ${JSON.stringify(doc.data())}`);
    });
    
    console.log('\n🎉 Todos os testes passaram! Firebase está funcionando corretamente.');
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error.code, '-', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔒 O erro é de permissão. Verifique as regras do Firestore.');
      console.log('As regras atuais podem estar muito restritivas.');
    } else if (error.code === 'not-found') {
      console.log('\n📝 A coleção/documento não foi encontrado.');
    } else if (error.code === 'unauthenticated') {
      console.log('\n🔐 Usuário não autenticado.');
    }
  }
  
  process.exit(0);
}

if (require.main === module) {
  testFirebaseConnection().catch(console.error);
}