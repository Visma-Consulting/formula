import { ThemeProvider } from '@mui/material';
import green from '@mui/material/colors/green';
import purple from '@mui/material/colors/purple';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import DLL from '@visma/formula/lib/dll';
import AppProvider from '@visma/react-app-super-template';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { homepage } from '../../package.json';
import LocaleSwitcher from './LocaleSwitcher';
import config from '@visma/public.config';

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

export default function App() {
  return (
    <AppProvider fallback={null}>
      <ThemeProvider theme={theme}>
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
                  <>
                    <DLL.Formula
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
                    <DLL.Formula
                      config={{
                        title: 'Field types',
                        elements: [
                          {
                            key: 'date',
                            type: 'date',
                            name: 'Date',
                          },
                          {
                            key: 'richtext',
                            type: 'richtext',
                            name: 'Rich Text',
                          },
                        ],
                      }}
                      onSubmit={({ values }) => console.log(values)}
                    />
                  </>
                )}
              />
              <Route
                path="/:id"
                render={({
                  match: {
                    params: { id },
                  },
                }) => (
                  <DLL.Formula
                    axios={(axios) => {
                      axios.defaults.baseURL = config.api.baseURL;
                    }}
                    id={id}
                  />
                )}
              />
            </Switch>
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </AppProvider>
  );
}
