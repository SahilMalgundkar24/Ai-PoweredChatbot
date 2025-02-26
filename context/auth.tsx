// context/auth.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  userName: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  userName: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    };

    loadUserName();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, userName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
