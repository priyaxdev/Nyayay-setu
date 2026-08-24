const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const TOKEN_KEY = 'nyayasetu_auth_token';
const USER_KEY = 'nyayasetu_user_profile';

export type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'CITIZEN' | 'POLICE';
  createdAt?: string;
  updatedAt?: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

export type PersonDetails = {
  name?: string | null;
  contact?: string | null;
  description?: string | null;
};

export type ComplaintData = {
  incidentType: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  victimName?: string | null;
  accusedName?: string | null;
  victim?: PersonDetails;
  accused?: PersonDetails;
  witnesses?: PersonDetails[];
  evidence?: string[];
  stolenItem: string | null;
  language: string | null;
  conversationHistory?: ChatMessage[];
};

export type ChatState = 'COLLECTING' | 'READY_FOR_CONFIRMATION';

export type ChatResponse = {
  success: boolean;
  conversationId: string;
  reply: string;
  state: ChatState;
  complaintData: ComplaintData;
  missingFields: string[];
  message?: string;
};

export type Complaint = ComplaintData & {
  complaintId: string;
  user: string | User;
  conversationId?: string | null;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'FIR_DRAFT_GENERATED' | 'OFFICER_VERIFICATION' | 'FIR_REGISTERED' | 'CLOSED' | string;
  createdAt: string;
  updatedAt: string;
};

// Token & Session Storage Utilities
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    // If token expired/invalid, clear local token
    if (res.status === 401 && path !== '/auth/login' && path !== '/auth/signup') {
      removeAuthToken();
      removeStoredUser();
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// ---------------- AUTH API ----------------
export function signupApi(params: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: 'CITIZEN' | 'POLICE';
}): Promise<{ success: boolean; message: string; user: User; token: string }> {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function loginApi(params: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; message: string; user: User; token: string }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function getMeApi(): Promise<{ success: boolean; user: User }> {
  return request('/auth/me');
}

// ---------------- CHAT API ----------------
export function sendChatMessage(params: {
  conversationId: string;
  message: string;
  language?: string;
  conversationHistory: ChatMessage[];
  currentComplaintData?: ComplaintData | null;
}): Promise<ChatResponse> {
  return request<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ---------------- COMPLAINTS API ----------------
export function submitComplaint(params: {
  conversationId?: string | null;
  complaintData: ComplaintData;
  aiConversation?: ChatMessage[];
}): Promise<{ success: boolean; complaint: Complaint }> {
  return request<{ success: boolean; complaint: Complaint }>('/complaints', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function fetchMyComplaints(): Promise<{ success: boolean; complaints: Complaint[] }> {
  return request<{ success: boolean; complaints: Complaint[] }>('/complaints');
}

export function fetchComplaintById(complaintId: string): Promise<{ success: boolean; complaint: Complaint }> {
  return request<{ success: boolean; complaint: Complaint }>(`/complaints/${encodeURIComponent(complaintId)}`);
}

export function checkHealth(): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>('/health');
}
