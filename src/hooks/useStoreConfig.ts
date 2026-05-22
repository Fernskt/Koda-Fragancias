import { useQuery } from '@tanstack/react-query';
import { storeConfigService } from '../services/storeConfigService';

export const useStoreConfig = () => {
  return useQuery({
    queryKey: ['store_config'],
    queryFn: storeConfigService.get,
    staleTime: 1000 * 60 * 10,
  });
};
