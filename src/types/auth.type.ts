export const EmailStatus = {
  Verified: 'Verified',
  NotFound: 'NotFound',
  NotVerified: 'NotVerified',
} as const;

export type EmailStatusType = typeof EmailStatus[keyof typeof EmailStatus];

export type SignInWithEmailAndPasswordInput = {
  email: string;
  password: string;
}

export type CheckEmailStatusRequest = {
  email: string;
}

export type CheckEmailStatusResponse = {
  status: EmailStatusType;
  email: string;
}