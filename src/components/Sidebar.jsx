import { auth } from '../firebase'; // Importe o auth

// ... dentro do seu componente ...

const handleLogout = async () => {
  try {
    await auth.signOut();
    localStorage.clear(); // Limpa qualquer lixo salvo
    window.location.href = "/"; // Força o redirecionamento para o login
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
};

// No botão:
// <button onClick={handleLogout}> ... Sair ... </button>
