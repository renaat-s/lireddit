import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({limit: 15, cursor: null as null | string});
  // const [{data, fetching, ...other}] = usePostsQuery({variables});
  const [{data,error,fetching}] = usePostsQuery({variables});
  
  if(!fetching && !data)
  {
    return (
      <div>
      <div>You got the following error: </div>
      <div>{error?.message}</div>
      </div>);
  }

  return (
  <Layout>    
    {!data && fetching ? 
      (<div>loading...</div>) 
      : (
        <Stack spacing={8}>
        {data!.posts.posts.map((p) =>
        !p ? null : (        
        // <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>          
        //   <UpdootSection post={p}/>
        //   <Box flex={1}>
        //     <NextLink href="/post/[id]" as={`/post/${p.id}`}>
        //     <Link mr={2}>
        //       <Heading fontSize='xl'>{p.title}</Heading> 
        //     </Link>
        //     </NextLink>
        //   <Text fontSize={12}>posted by {p.creator.username}</Text>
        //   {/* <Text fontSize={12}>post id {p.id}</Text> */}
        //   {/* <Text fontSize={12}>post votestatus {p.voteStatus ? p.voteStatus : "null"}</Text> */}
        //   <Flex align="center">
        //     <Text flex={1} mt={4}>{p.textSnippet}</Text>
        //     <IconButton ml="auto" aria-label="Delete Post" icon={<DeleteIcon/>} colorScheme="orange" >Delete Post</IconButton>
        //   </Flex>
        //   </Box>
          
        // </Flex>

        <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
        <UpdootSection post={p} />
        <Box flex={1}>
          <NextLink href="/post/[id]" as={`/post/${p.id}`}>
            <Link>
              <Heading fontSize="xl">{p.title}</Heading>
            </Link>
          </NextLink>
          <Text fontSize={12}>posted by {p.creator.username}</Text>
          <Flex align="center">
            <Text flex={1} mt={4}>
              {p.textSnippet}
            </Text>
                                    
            <Box ml="auto">
              <EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>
            </Box>

          </Flex>
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

export default withUrqlClient(createUrlClient ,{ssr: true}) (Index);