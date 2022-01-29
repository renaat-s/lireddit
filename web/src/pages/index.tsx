import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrlClient } from "../utils/createURLClient";

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
  <Layout>
    <NextLink href="/create-post">
      <Link>create post</Link>
      </NextLink>
    <div>hello world</div>
  <br/>
    {!data ? 
      (<div>loading...</div>) 
      : 
      (data.posts.map((p) => <div key={p.id}>{p.title}</div>))}
  </Layout>)
};

export default withUrqlClient(createUrlClient ,{ssr: true}) (Index);