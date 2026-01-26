import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [incomeList, setIncomeList] = useState([]); // Lista de Rendas
  const [goals, setGoals] = useState([]);
  const [bills, setBills] = useState([]); // Contas a Pagar
  const [cards, setCards] = useState([]); // Cartões de Crédito
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // 1. Monitora Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Busca perfil do usuário (para pegar o código do bot)
        const userRef = doc(db, 'users', currentUser.uid);
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) setUserProfile(docSnap.data());
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Monitora Coleções do Firebase em Tempo Real
  useEffect(() => {
    if (!user) {
        setTransactions([]);
        setIncomeList([]);
        setGoals([]);
        setBills([]);
        setCards([]);
        return;
    }

    // TRANSAÇÕES
    const qTrans = query(collection(db, 'transactions'), where('uid', '==', user.uid));
    const unsubTrans = onSnapshot(qTrans, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });

    // RENDAS (INCOMES)
    const qIncome = query(collection(db, 'incomes'), where('uid', '==', user.uid));
    const unsubIncome = onSnapshot(qIncome, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIncomeList(data);
    });

    // CAIXINHAS (GOALS)
    const qGoals = query(collection(db, 'goals'), where('uid', '==', user.uid));
    const unsubGoals = onSnapshot(qGoals, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGoals(data);
    });

    // CONTAS A PAGAR (BILLS)
    const qBills = query(collection(db, 'bills'), where('uid', '==', user.uid));
    const unsubBills = onSnapshot(qBills, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBills(data);
    });
    
    // CARTÕES (CARDS)
    const qCards = query(collection(db, 'cards'), where('uid', '==', user.uid));
    const unsubCards = onSnapshot(qCards, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCards(data);
    });

    return () => { 
        unsubTrans(); 
        unsubIncome(); 
        unsubGoals(); 
        unsubBills(); 
        unsubCards();
    };
  }, [user]);

  // --- AÇÕES DO BANCO DE DADOS ---

  // GASTOS
  const addTransaction = async (transaction) => {
    if (!user) return;
    await addDoc(collection(db, 'transactions'), { ...transaction, uid: user.uid });
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'transactions', id)); // DELETA DO FIREBASE
    } catch (error) {
        console.error("Erro ao deletar transação:", error);
    }
  };

  // RENDAS
  const addIncome = async (income) => {
    if (!user) return;
    await addDoc(collection(db, 'incomes'), { ...income, uid: user.uid });
  };

  const deleteIncome = async (id) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'incomes', id)); // DELETA DO FIREBASE
    } catch (error) {
        console.error("Erro ao deletar renda:", error);
    }
  };

  // CAIXINHAS
  const addGoal = async (goal) => {
    if (!user) return;
    await addDoc(collection(db, 'goals'), { ...goal, uid: user.uid });
  };

  const deleteGoal = async (id) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'goals', id)); // DELETA DO FIREBASE
    } catch (error) {
        console.error("Erro ao deletar meta:", error);
    }
  };

  const updateGoalAmount = async (id, amountToAdd) => {
      if (!user) return;
      const goal = goals.find(g => g.id === id);
      if (goal) {
          await updateDoc(doc(db, 'goals', id), {
              currentAmount: (goal.currentAmount || 0) + Number(amountToAdd)
          });
      }
  };

  // CONTAS
  const addBill = async (bill) => {
      if (!user) return;
      await addDoc(collection(db, 'bills'), { ...bill, uid: user.uid });
  };

  const deleteBill = async (id) => {
      if (!user) return;
      try {
        await deleteDoc(doc(db, 'bills', id)); // DELETA DO FIREBASE
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
      }
  };

  const updateBillStatus = async (id, status) => {
      if (!user) return;
      await updateDoc(doc(db, 'bills', id), { status });
  };

  // CARTÕES
  const addCard = async (card) => {
      if (!user) return;
      await addDoc(collection(db, 'cards'), { ...card, uid: user.uid });
  };

  const deleteCard = async (id) => {
      if (!user) return;
      try {
        await deleteDoc(doc(db, 'cards', id)); // DELETA DO FIREBASE
      } catch (error) {
        console.error("Erro ao deletar cartão:", error);
      }
  };

  // BOT TELEGRAM (Gera código único)
  const generateBotToken = async () => {
    if (!user) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Gera 6 dígitos
    await updateDoc(doc(db, 'users', user.uid), { botCode: code });
    return code;
  };

  return (
    <FinanceContext.Provider value={{
      user, userProfile, transactions, incomeList, goals, bills, cards, currentDate, setCurrentDate,
      addTransaction, deleteTransaction,
      addIncome, deleteIncome,
      addGoal, deleteGoal, updateGoalAmount,
      addBill, deleteBill, updateBillStatus,
      addCard, deleteCard,
      generateBotToken
    }}>
      {!loading && children}
    </FinanceContext.Provider>
  );
};