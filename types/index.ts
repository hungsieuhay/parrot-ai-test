import { Dispatch, SetStateAction } from 'react';

export interface Answer {
  id: string;
  name: string;
  point: number;
  time: number;
  audioUrl: string;
}

export type AnswerForm = Omit<Answer, 'id'>;

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export interface ToastContextType {
  addToast: (message: string, type?: Toast['type']) => void;
}

export interface AnswerContextType {
  handleSubmitAnswer: (values: AnswerForm) => void;
  setUploadUrl: Dispatch<SetStateAction<string>>;
  uploadUrl: string;
}
