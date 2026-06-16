export interface User {
  _id: string;
  role: 'buyer' | 'supplier';
  email: string;
  fullName: string;
  companyName: string;
  city?: string;
  state?: string;
  contactNumber?: string;
  gstNumber?: string;
  procurementPreferences?: string;
  savedListings?: string[];
}

export interface LoginCredentials {
  email: string;
  password?: string;
  [key: string]: unknown;
}

export interface SignupCredentials {
  role: 'buyer' | 'supplier';
  email: string;
  password?: string;
  fullName: string;
  companyName: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginCredentials) => Promise<User>;
  signup: (data: SignupCredentials) => Promise<User>;
  googleLogin: (data: { credential: string; role?: string }) => Promise<User>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}
