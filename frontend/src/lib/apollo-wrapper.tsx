'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export function ApolloWrapper({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
