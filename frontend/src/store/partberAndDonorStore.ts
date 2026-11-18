import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const API_BASE_URL = import.meta.env.VITE_API_URL;
export type PartnerDonorKind = 'partner' | 'donor';
export type PartnerType = 'Employer' | 'Client' | 'Training partner' | 'Donor';

export type PartnerDonorDetails = {
  id: string;
  kind: PartnerDonorKind;
  organisation: string;
  partnerType: PartnerType;
  country: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  contactName: string;
  createdAt: string;
};

export type PartnerDonorInput = {
  id?: string;
  kind: PartnerDonorKind;
  organisation: string;
  partnerType?: PartnerType;
  country: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  contactName: string;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `partner-donor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizePartnerDonor = (payload: PartnerDonorInput): PartnerDonorDetails => ({
  id: payload.id ?? createId(),
  kind: payload.kind,
  organisation: payload.organisation.trim(),
  partnerType: payload.partnerType ?? (payload.kind === 'donor' ? 'Donor' : 'Employer'),
  country: payload.country.trim(),
  description: payload.description.trim(),
  website: payload.website?.trim() || undefined,
  email: payload.email.trim().toLowerCase(),
  phone: payload.phone?.trim() || undefined,
  contactName: payload.contactName.trim(),
  createdAt: new Date().toISOString(),
});

type PartnerDonorState = {
  items: PartnerDonorDetails[];
  loading: boolean;
  error: string | null;
  registerPartner: (payload: Omit<PartnerDonorInput, 'kind'> & { kind?: PartnerDonorKind }) => Promise<void>;
  registerDonor: (payload: Omit<PartnerDonorInput, 'kind'> & { kind?: PartnerDonorKind }) => Promise<void>;
  registerPartnerOrDonor: (payload: PartnerDonorInput) => Promise<void>;
  updateDetail: (id: string, updates: Partial<Omit<PartnerDonorDetails, 'id' | 'createdAt'>>) => void;
  deleteDetail: (id: string) => void;
  clearError: () => void;
  reset: () => void;
};

export const usePartnerDonorStore = create<PartnerDonorState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      async registerPartner(payload) {
        set({ loading: true, error: null });

        try {
          const partnerPayload: PartnerDonorInput = {
            ...payload,
            kind: 'partner',
            partnerType: payload.partnerType ?? 'Employer',
          };

          const nextItem = normalizePartnerDonor(partnerPayload);

          set((state) => ({
            items: [nextItem, ...state.items],
            loading: false,
            error: null,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to save partner';
          set({ loading: false, error: message });
          throw error;
        }
      },

      async registerDonor(payload) {
        set({ loading: true, error: null });

        try {
          const donorPayload: PartnerDonorInput = {
            ...payload,
            kind: 'donor',
            partnerType: 'Donor',
          };

          const nextItem = normalizePartnerDonor(donorPayload);

          set((state) => ({
            items: [nextItem, ...state.items],
            loading: false,
            error: null,
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to save donor';
          set({ loading: false, error: message });
          throw error;
        }
      },

      async registerPartnerOrDonor(payload) {
        if (payload.kind === 'donor') {
          await get().registerDonor(payload);
          return;
        }

        await get().registerPartner(payload);
      },

      updateDetail(id, updates) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  partnerType: updates.partnerType ?? item.partnerType,
                }
              : item,
          ),
        }));
      },

      deleteDetail(id) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearError() {
        set({ error: null });
      },

      reset() {
        set({ items: [], loading: false, error: null });
      },
    }),
    {
      name: 'konexio-partner-donor-store',
    },
  ),
);

export default usePartnerDonorStore;

