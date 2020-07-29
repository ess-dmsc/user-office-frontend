import { useEffect, useState } from 'react';

import { Call } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export function useCallsData(isActive?: boolean, templateId?: number) {
  const [callsData, setCallsData] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  const api = useDataApi();

  useEffect(() => {
    api()
      .getCalls({
        filter: {
          isActive,
          templateIds: templateId ? [templateId] : undefined,
        },
      })
      .then(data => {
        if (data.calls) {
          setCallsData(data.calls);
        }
        setLoading(false);
      });
  }, [api, isActive, templateId]);

  return { loading, callsData, setCallsData };
}