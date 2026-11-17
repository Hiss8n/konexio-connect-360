export type AuthUser = {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  has_organisation: boolean;
  account_type?: 'learner' | 'alumni' | 'partner' | 'donor';
};

export type LoginPayload = {
  email: string;
  password: string;
  account_type?: 'learner' | 'alumni' | 'partner' | 'donor';
};

export type RegisterPayload = {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  has_organisation?: boolean;
  account_type: 'learner' | 'alumni' | 'partner' | 'donor';
  city?: string;
  country?: string;
  pathway_code?: string;
  learning_goal?: string;
  short_bio?: string;
  skills?: string[];
  languages?: string[];
  availability?: string;
  portfolio_title?: string;
  portfolio_url?: string;
  personal_website?: string;
  linkedin_url?: string;
  consent_to_publish?: boolean;
  consent_to_show_photo?: boolean;
  organisation?: string;
  partner_type?: 'Employer' | 'Client' | 'Training partner' | 'Donor';
  description?: string;
  website?: string;
  phone?: string;
};

export type AuthResponsePayload = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};