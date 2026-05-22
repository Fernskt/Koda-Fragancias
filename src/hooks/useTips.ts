import { useQuery } from '@tanstack/react-query';
import { tipsService } from '../services/tipsService';

export const useTips = () => {
  return useQuery({
    queryKey: ['tips'],
    queryFn: tipsService.getAll,
    staleTime: 1000 * 60 * 10,
  });
};
