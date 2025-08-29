'use client';

import { FormSubmit } from '@/components/form-submit';
import { ConfettiAnimation } from '@/motion/conffeti-animation';
import { useAnswer } from '@/provider/answer-provider';

const AnswerFormPage = () => {
  const { showConfetti } = useAnswer();

  return (
    <div className="relative container">
      <ConfettiAnimation isActive={showConfetti} />
      <div className="mx-auto max-w-screen-sm">
        <div className="relative mt-32 flex flex-col items-center text-center">
          <h2 className="font-medium text-white/50 uppercase">Submit Form</h2>
          <h1 className="mt-10 text-2xl font-bold text-white uppercase sm:text-4xl">
            Send your answer
          </h1>
          <div className="mt-10 w-full">
            <FormSubmit />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerFormPage;
