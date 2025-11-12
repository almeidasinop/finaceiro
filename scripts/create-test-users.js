import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

// Configuração do Firebase (usando as mesmas variáveis do projeto)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Usuários de teste para criar
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'Admin123!',
    displayName: 'Administrador'
  },
  {
    email: 'user1@example.com',
    password: 'User123!',
    displayName: 'João Silva'
  },
  {
    email: 'user2@example.com',
    password: 'User123!',
    displayName: 'Maria Santos'
  },
  {
    email: 'user3@example.com',
    password: 'User123!',
    displayName: 'Pedro Oliveira'
  }
];

async function createTestUsers() {
  console.log('🚀 Iniciando criação de usuários de teste...\n');
  
  for (const userData of testUsers) {
    try {
      console.log(`👤 Criando usuário: ${userData.email}`);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Atualizar perfil com displayName
      await userCredential.user.updateProfile({
        displayName: userData.displayName
      });
      
      console.log(`✅ Usuário criado com sucesso: ${userData.displayName} (${userData.email})`);
      console.log(`   UID: ${userCredential.user.uid}\n`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Usuário já existe: ${userData.email}`);
      } else {
        console.error(`❌ Erro ao criar usuário ${userData.email}:`, error.message);
      }
    }
  }
  
  console.log('🎉 Processo de criação de usuários de teste concluído!');
  console.log('\n📋 Resumo dos usuários de teste:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testUsers.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Senha: ${user.password}`);
    console.log(`Nome: ${user.displayName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
  
  console.log('\n💡 Dicas de uso:');
  console.log('- Use estes usuários para testar o sistema de login');
  console.log('- Cada usuário terá seus próprios dados isolados');
  console.log('- Você pode adicionar mais usuários editando este script');
}

// Executar o script
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUsers().catch(console.error);
}

export { createTestUsers };