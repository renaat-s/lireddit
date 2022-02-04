import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { PaginatedPosts } from "../generated/graphql";
import theme from "../theme";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,    
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(existing: PaginatedPosts | undefined , incoming: PaginatedPosts): PaginatedPosts{
              return {
                ...incoming,
                posts: [...(existing?.posts || []),...incoming.posts]
              };
            }
          }
        }
      }
    }
  }    
  )
});

function MyApp({ Component, pageProps }: any) {
  return (
    
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: false,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    
  );
}

export default MyApp;