// Drop this into your existing src/ (e.g. src/lib/api.ts or src/services/api.ts)
// once your real project files are available. Adjust the import paths in
// useComplaintChat.ts to match wherever you place it.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type ComplaintData = {
  incidentType: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  victim?: Record<string, unknown>;
  accused?: Record<string, unknown>;
  witnesses?: unknown[];
  evidence?: unknown[];
  stolenItem: string | null;
  language: string | null;
};

export type ChatState = 'COLLECTING' | 'READY_FOR_CONFIRMATION';

export type ChatResponse = {
  success: boolean;
  conversationId: string;
  reply: string;
  state: ChatState;
  complaintData: ComplaintData;
  missingFields: string[];
  message?: string; // present on error responses
};

export type Complaint = ComplaintData & {
  complaintId: string;
  conversationId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data as T;
}

export function sendChatMessage(params: {
  conversationId: string;
  message: string;
  language?: string;
  conversationHistory: ChatMessage[];
  currentComplaintData?: ComplaintData | null;
}): Promise<ChatResponse> {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function submitComplaint(params: {
  conversationId: string;
  complaintData: ComplaintData;
}): Promise<{ success: boolean; complaint: Complaint }> {
  return request('/complaints', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function fetchMyComplaints(userId?: string): Promise<{ success: boolean; complaints: Complaint[] }> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return request(`/complaints${query}`);
}

export function fetchComplaintById(complaintId: string): Promise<{ success: boolean; complaint: Complaint }> {
  return request(`/complaints/${encodeURIComponent(complaintId)}`);
}
