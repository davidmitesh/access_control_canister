import * as React from 'react';
// import { access_control } from "../../declarations/hello"
import { Provider,defaultTheme, Flex } from '@adobe/react-spectrum';
import styled from 'styled-components'
import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { useEffect } from "react";
import { _SERVICE } from '../../declarations/access_control/access_control.did';

import NotAuthenticated from "./components/NotAuthenticated";
import Home from './components/Home';
import { canisterId, createActor } from '../../declarations/access_control';
import { Principal } from '@dfinity/principal';
const Header = styled.header`
  position: relative;
  padding: 1rem;
  display: flex;
  justify-content: center;
  h1 {
    margin-top: 0;
  }
  #logout {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

//declaring the app context

export const AppContext = React.createContext<{
  authClient?: AuthClient;
  setIsAuthenticated?:React.Dispatch<boolean>;
  // setAuthClient?: React.Dispatch<AuthClient>;
  // isAuthenticated?: boolean;
  actor ?: ActorSubclass<_SERVICE> | undefined;
  principalId?:Principal;
  setPrincipalId?:React.Dispatch<Principal>;
}>({
  
});

const App = () => {

  const [authClient,setAuthClient]=React.useState<AuthClient | undefined>(undefined)
  const [actor, setActor] = React.useState<ActorSubclass<_SERVICE>>();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
   const [isLoaded,setIsLoaded] = React.useState<boolean>(false)
   const [loadingMessage,setLoadingMessage] = React.useState("")
  useEffect( ()=>{
    AuthClient.create().then(async (client)=>{
      // console.log(client)
      setAuthClient(client)
      setIsAuthenticated(await client.isAuthenticated())
      setIsLoaded(true)
      console.log('from first useEffect')
    })
  },[])

  useEffect(()=>{
    if (!authClient) return ;
    const identity=authClient.getIdentity()
    const actor = createActor("tcvdh-niaaa-aaaaa-aaaoa-cai",{
      agentOptions:{
        identity
      }
    })
    setActor(actor)
  },[authClient])

  return (
      <Provider theme={defaultTheme}>
        <AppContext.Provider value={{
          authClient,
          setIsAuthenticated,
          actor
        }}
        >
          <Main>
              <Header>
                  <h2>BigIdea Applications</h2>
              </Header>
              <Flex maxWidth={900} margin="1rem auto"> 
                {!isAuthenticated && !loadingMessage ?  (
                <NotAuthenticated/>
                ): (
                  <Home/>
                )}
              </Flex>
          </Main>
          
        </AppContext.Provider>
      </Provider>
      
  )
}

export default App;