import { useCallback, useState } from "react";
import { useDataAPI } from "./useDataAPI";

export function useUpdateProposalFiles() 
{
  const sendRequest = useDataAPI();
  const [loading, setLoading] = useState(false);

  const updateProposalFiles = useCallback(
    async ( parameters: { proposal_id:number, question_id?:string, files:string[]}) => 
    {
      const query = `
      mutation($proposal_id: ID!, $question_id:ID!, $files:[String]) {
        updateProposalFiles(proposal_id: $proposal_id, question_id:$question_id, files:$files){
         files
         error
        }
      }
      `;

      setLoading(true);
      const result = await sendRequest(query, parameters).then(resp => resp);
      setLoading(false);
      return result;
    },
    [sendRequest]

  );

  return {loading, updateProposalFiles};

}

