import { MTableToolbar, Options } from 'material-table';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import SelectedCallFilter from 'components/common/SelectedCallFilter';
import { useCallsData } from 'hooks/call/useCallsData';

import SEPProposalsAndAssignmentsTable from './SEPProposalsAndAssignmentsTable';

type SEPProposalsAndAssignmentsProps = {
  /** Id of the SEP we are assigning members to */
  sepId: number;
};

const SEPProposalsAndAssignments: React.FC<SEPProposalsAndAssignmentsProps> = ({
  sepId,
}) => {
  const { loadingCalls, callsData } = useCallsData();
  const [selectedCallId, setSelectedCallId] = useState<number>(0);

  const Toolbar = (data: Options): JSX.Element =>
    loadingCalls ? (
      <div>Loading...</div>
    ) : (
      <>
        <MTableToolbar {...data} />
        <SelectedCallFilter
          callsData={callsData}
          onChange={setSelectedCallId}
          shouldShowAll={true}
          callId={selectedCallId}
        />
      </>
    );

  return (
    <SEPProposalsAndAssignmentsTable
      sepId={sepId}
      selectedCallId={selectedCallId}
      Toolbar={Toolbar}
    />
  );
};

SEPProposalsAndAssignments.propTypes = {
  sepId: PropTypes.number.isRequired,
};

export default SEPProposalsAndAssignments;
