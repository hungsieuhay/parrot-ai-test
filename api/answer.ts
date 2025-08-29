import { Answer, AnswerForm } from '@/types';
import axiosClient from './axios-client';

const answerApi = {
  async getRankData(): Promise<Array<Answer>> {
    const response = axiosClient.get<Array<Answer>>('/user-points');
    return response;
  },
  async postUserAnswer(values: AnswerForm): Promise<AnswerForm> {
    const response = axiosClient.post<AnswerForm>('/user-points', values);
    return response;
  },
};

export default answerApi;
