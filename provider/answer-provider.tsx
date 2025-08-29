'use client';

import answerApi from '@/api/answer';
import { AnswerContextType, AnswerForm } from '@/types';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

const AnswerContext = createContext<AnswerContextType | undefined>(undefined);

export const useAnswer = () => {
  const context = useContext(AnswerContext);
  if (context === undefined) {
    throw new Error('useAnswer must be used within an AnswerProvider');
  }
  return context;
};

export const AnswerProvider = ({ children }: PropsWithChildren) => {
  const [uploadUrl, setUploadUrl] = useState<string>('');

  const handleSubmitAnswer = useCallback(async (data: AnswerForm) => {
    try {
      await answerApi.postUserAnswer(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <AnswerContext.Provider
      value={{
        handleSubmitAnswer,
        uploadUrl,
        setUploadUrl,
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};
