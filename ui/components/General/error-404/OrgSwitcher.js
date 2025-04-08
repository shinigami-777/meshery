import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import { NoSsr } from '@layer5/sistent';
import { setOrganization, setKeys } from 'lib/store';
import { EVENT_TYPES } from 'lib/event-types';
import { useNotification } from 'utils/hooks/useNotification';
import { useGetOrgsQuery } from 'rtk-query/organization';
import OrgIcon from 'assets/icons/OrgIcon';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { ErrorBoundary, FormControl, FormGroup, MenuItem } from '@layer5/sistent';
import {
  OrgName,
  StyledSelect,
  StyledFormControlLabel,
  StyledTypography,
  CustomDownIcon,
} from './styles';
import { useGetCurrentAbilities } from 'rtk-query/ability';
import CustomErrorFallback from '../ErrorBoundary';
import { useTheme } from '@layer5/sistent';

const OrgSwitcher = (props) => {
  const {
    data: orgsResponse,
    isSuccess: isOrgsSuccess,
    isError: isOrgsError,
    error: orgsError,
  } = useGetOrgsQuery({});
  let orgs = orgsResponse?.organizations || [];
  const { organization, setOrganization, setKeys } = props;
  const [skip, setSkip] = React.useState(true);

  const { notify } = useNotification();

  useGetCurrentAbilities(organization, setKeys, skip);

  useEffect(() => {
    if (isOrgsError) {
      notify({
        message: `There was an error fetching available data ${orgsError?.data}`,
        event_type: EVENT_TYPES.ERROR,
      });
    }
  }, [orgsError]);

  const handleOrgSelect = (e) => {
    const id = e.target.value;
    const selected = orgs.find((org) => org.id === id);
    setOrganization({ organization: selected });
    setSkip(false);

    setTimeout(() => {
      location.reload();
    }, 1000);
  };
  const theme = useTheme();
  return (
    <NoSsr>
      <>
        <FormControl fullWidth component="fieldset">
          <StyledTypography variant="h6" component="h6">
            Switch Organization
          </StyledTypography>
          <FormGroup>
            <StyledFormControlLabel
              key="OrgSwitcher"
              control={
                <StyledSelect
                  fullWidth
                  value={organization?.id ? organization.id : ''}
                  onChange={handleOrgSelect}
                  SelectDisplayProps={{ style: { display: 'flex' } }}
                  IconComponent={CustomDownIcon}
                >
                  {isOrgsSuccess &&
                    orgs &&
                    orgs?.map((org) => {
                      return (
                        <MenuItem key={org.id} value={org.id}>
                          <OrgIcon
                            width="24"
                            height="24"
                            secondaryFill={theme.palette.icon.secondary}
                          />
                          <OrgName>{org.name}</OrgName>
                        </MenuItem>
                      );
                    })}
                </StyledSelect>
              }
            />
          </FormGroup>
        </FormControl>
      </>
    </NoSsr>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOrganization: bindActionCreators(setOrganization, dispatch),
  setKeys: bindActionCreators(setKeys, dispatch),
});

const mapStateToProps = (state) => {
  const organization = state.get('organization');
  return {
    organization,
  };
};

const OrgSwitcherWithErrorBoundary = (props) => {
  return (
    <NoSsr>
      <ErrorBoundary customFallback={CustomErrorFallback}>
        <Provider store={store}>
          <OrgSwitcher {...props} />
        </Provider>
      </ErrorBoundary>
    </NoSsr>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(OrgSwitcherWithErrorBoundary));
