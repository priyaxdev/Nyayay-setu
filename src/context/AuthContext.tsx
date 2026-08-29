import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  signupApi,
  loginApi,
  getMeApi,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  type User,
} from "../services/api";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password?: string,
    role?: "CITIZEN" | "POLICE",
  ) => Promise<User>;
  signup: (params: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: "CITIZEN" | "POLICE";
    badgeNumber?: string;
    station?: string;
  }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMeApi();
        setUser(res.user);
        setStoredUser(res.user);
      } catch (err) {
        console.warn("Session expired or invalid token:", err);
        removeAuthToken();
        removeStoredUser();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (
    email: string,
    password?: string,
    role?: "CITIZEN" | "POLICE",
  ): Promise<User> => {
    const res = await loginApi({ email, password, role });
    setAuthToken(res.token);
    setStoredUser(res.user);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const signup = async (params: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: "CITIZEN" | "POLICE";
    badgeNumber?: string;
    station?: string;
  }): Promise<User> => {
    const res = await signupApi(params);
    setAuthToken(res.token);
    setStoredUser(res.user);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    removeAuthToken();
    removeStoredUser();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async (): Promise<User | null> => {
    try {
      const res = await getMeApi();
      setUser(res.user);
      setStoredUser(res.user);
      return res.user;
    } catch {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
