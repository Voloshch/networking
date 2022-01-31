import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import React from "react";
import { Loader, Segment } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { AppRoutes, paths } from './AppRoutes';
import { updateAccounts, updateUser, changeLang } from './AppActions';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

const Chrome = React.lazy(() => import("microFrontEnd1/MicroFrontEnd1Index"));

const App = ({ intl, history }) => {
  const dispatch = useDispatch();

  return (
    <React.Suspense fallback={
      <Segment className='start-loader'>
        <Loader active inline='centered' />
      </Segment>
    }>
      <Chrome id='compute'
        name='ICDC Networking'
        changeAccounts={accountsInfo => dispatch(updateAccounts(accountsInfo))}
        changeUser={userInfo => dispatch(updateUser(userInfo))}
        routes={paths}
        locale={intl.locale}
        changeLang={lang => dispatch(changeLang(lang))}
        changeApp={newApp => history.push(newApp)}
      >
        <AppRoutes />
      </Chrome>
    </React.Suspense>
  )
};

export default withRouter(injectIntl(App));
