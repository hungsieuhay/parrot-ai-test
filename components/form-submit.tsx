'use client';

import { useAnswer } from '@/provider/answer-provider';
import { useToast } from '@/provider/toast-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Recoreder } from './recorder';
import { CustomInput } from './text-field';

const formSchema = z.object({
  name: z.string().nonempty('Full name is required field').min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  point: z
    .string()
    .min(1, 'Point is required field')
    .regex(/^\d+$/, 'Must be a number'),
  time: z
    .string()
    .min(1, 'Time is required field')
    .regex(/^\d+$/, 'Must be number'),
  audioUrl: z.string().nonempty('Audio is required field'),
});

type SubmitForm = z.infer<typeof formSchema>;

export const FormSubmit = () => {
  const { addToast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    watch,
    reset,

    setValue,
  } = useForm<SubmitForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      point: '',
      time: '',
      audioUrl: '',
    },
    mode: 'onSubmit',
  });
  const { handleSubmitAnswer, uploadUrl } = useAnswer();

  const point = Number(watch('point'));
  const time = Number(watch('time'));

  useEffect(() => {
    if (uploadUrl) {
      setValue('audioUrl', uploadUrl);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [uploadUrl]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(undefined, { keepIsSubmitSuccessful: false });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data: SubmitForm) => {
    try {
      await handleSubmitAnswer({ ...data, point, time });
      addToast('Submit sucessfully', 'success');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      <CustomInput
        name="name"
        control={control}
        placeholder="Full name"
        error={errors.name}
      />
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-1/2">
          <CustomInput
            name="point"
            control={control}
            placeholder="Score"
            error={errors.point}
          />
        </div>
        <div className="w-1/2">
          <CustomInput
            name="time"
            control={control}
            placeholder="Time (ms)"
            error={errors.time}
          />
        </div>
      </div>
      <div>
        <Recoreder isSubmitSuccessful={isSubmitSuccessful} />
        <CustomInput
          name="audioUrl"
          control={control}
          placeholder="Enter your time complete"
          error={errors.audioUrl}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="w-full rounded-md bg-gradient-to-r from-blue-400 to-purple-600 py-4 text-lg font-medium text-white disabled:bg-blue-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};
