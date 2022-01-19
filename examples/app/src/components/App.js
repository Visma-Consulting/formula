import Container from '@material-ui/core/Container';
import Formula from '@visma/formula';
import AppProvider from '@visma/react-app-super-template';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { homepage } from '../../package.json';
import LocaleSwitcher from './LocaleSwitcher';

export default function App() {
  return (
    <AppProvider fallback={null}>
      <Container maxWidth="md">
        <LocaleSwitcher />
        <BrowserRouter
          basename={process.env.NODE_ENV === 'test' ? undefined : homepage}
        >
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <Formula
                  config={{
                    title: 'Log In',
                    elements: [
                      {
                        key: 'email',
                        type: 'email',
                        name: 'Email Address',
                        required: true,
                      },
                      {
                        key: 'password',
                        type: 'password',
                        name: 'Password',
                        required: true,
                      },
                    ],
                  }}
                  onSubmit={({ values }) => console.log(values)}
                />
              )}
            />
            <Route
              path="/:id"
              render={({
                match: {
                  params: { id },
                },
              }) => (
                <Formula
                  axios={(axios) => {
                    axios.defaults.baseURL =
                      'https://visma.formula-demo.fi/api';
                  }}
                  id={id}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </Container>
    </AppProvider>
  );
}
