import Grid from '@material-ui/core/Grid';
import { Edit } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { UserRole } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';

import { InviteUserForm } from './InviteUserForm';
import PeopleTable from './PeopleTable';

export default function PeoplePage() {
  const [userData, setUserData] = useState<{ id: number } | null>(null);
  const [sendUserEmail, setSendUserEmail] = useState({
    show: false,
    title: '',
    userRole: UserRole.USER,
  });
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  if (userData) {
    setTimeout(() => {
      history.push(`/PeoplePage/${userData.id}`);
    });
  }

  const invitationButtons = [];

  invitationButtons.push({
    title: 'Invite User',
    action: () =>
      setSendUserEmail({
        show: true,
        title: 'Invite User',
        userRole: UserRole.USER,
      }),
  });

  invitationButtons.push({
    title: 'Invite Reviewer',
    action: () =>
      setSendUserEmail({
        show: true,
        title: 'Invite Reviewer',
        userRole: UserRole.REVIEWER,
      }),
  });

  return (
    <React.Fragment>
      <ContentContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} data-cy="people-table">
            <StyledPaper>
              {sendUserEmail.show ? (
                <InviteUserForm
                  title={sendUserEmail.title}
                  userRole={sendUserEmail.userRole}
                  close={() =>
                    setSendUserEmail({
                      show: false,
                      title: '',
                      userRole: UserRole.USER,
                    })
                  }
                  action={() => console.log()}
                />
              ) : (
                <PeopleTable
                  title="Users"
                  actionText="Edit user"
                  actionIcon={<Edit />}
                  action={setUserData}
                  selection={false}
                  invitationButtons={invitationButtons}
                  onRemove={(user: { id: number }) =>
                    api()
                      .deleteUser({ id: user.id })
                      .then(
                        data =>
                          data.deleteUser.error &&
                          enqueueSnackbar(data.deleteUser.error, {
                            variant: 'error',
                          })
                      )
                  }
                />
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </ContentContainer>
    </React.Fragment>
  );
}
