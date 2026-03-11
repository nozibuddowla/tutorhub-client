import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import auth from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL;
const googleProvider = new GoogleAuthProvider(); // moved outside — created once, not on every render

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  // ─── AXIOS 401 INTERCEPTOR ────────────────────────────────────────────────
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || "";
        const noRetry = error?.config?._retry;

        const isAuthEndpoint =
          url.includes("/jwt") ||
          url.includes("/logout") ||
          url.includes("/users/role");

        if (status === 401 && !noRetry && !isAuthEndpoint) {
          error.config._retry = true;
          try {
            await axios.post(`${API}/logout`, {}, { withCredentials: true });
          } catch {
            // silent — logout anyway
          }
          await signOut(auth);
          setUser(null);
          setRole("");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ─── AUTH METHODS (stable references with useCallback) ───────────────────
  const createUser = useCallback((email, pass) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, pass);
  }, []);

  const signIn = useCallback((email, pass) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, pass);
  }, []);

  const signInWithGoogle = useCallback(() => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  }, []);

  const logOut = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/logout`, {}, { withCredentials: true });
    } finally {
      // always sign out of Firebase even if API call fails
      await signOut(auth);
      setUser(null);
      setRole("");
    }
  }, []);

  // ─── AUTH STATE LISTENER ──────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data } = await axios.get(
            `${API}/users/role/${currentUser.email}`,
          );
          if (data.success) {
            setRole(data.role);
            await axios.post(
              `${API}/jwt`,
              { email: currentUser.email },
              { withCredentials: true },
            );
          }
        } catch {
          // don't expose error in production — default to student
          setRole("student");
        }
      } else {
        setRole("");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ─── MEMOIZED CONTEXT VALUE (prevents all consumers re-rendering) ─────────
  const authData = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      createUser,
      signIn,
      signInWithGoogle,
      logOut,
      role,
      setRole,
    }),
    [user, loading, role, createUser, signIn, signInWithGoogle, logOut],
  );

  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
