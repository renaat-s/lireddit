import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({limit: 15, cursor: null as null | string});
  const [{data, fetching, ...other}] = usePostsQuery({variables});

  console.log(fetching, other);

  if(!fetching && !data)
  {
    return <div>you got query failed for some reason</div>
  }

  return (
  <Layout>
    <Flex align='center'>
      <Heading>LiReddit</Heading>      
      <NextLink href="/create-post">
      <Link ml='auto'>create post</Link>
      </NextLink>    
    </Flex>    
  <br/>
    {!data && fetching ? 
      (<div>loading...</div>) 
      : (
        <Stack spacing={8}>
        {data!.posts.posts.map((p) => (        
        <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>          
          <UpdootSection post={p}/>
          <Box>
          <Heading fontSize='xl'>{p.title}</Heading> 
          <Text fontSize={12}>posted by {p.creator.username}</Text>
          <Text fontSize={12}>post id {p.id}</Text>
          <Text fontSize={12}>post votestatus {p.voteStatus ? p.voteStatus : "null"}</Text>
          <Text mt={4}>{p.textSnippet}</Text>
          </Box>
          
        </Flex>
        ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
      <Button isLoading={fetching} m="auto" my={6} onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}>load more</Button>
      </Flex>):null}
  </Layout>)
};

export default withUrqlClient(createUrlClient ,{ssr: false}) (Index);