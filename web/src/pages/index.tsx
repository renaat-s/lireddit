import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({limit: 15, cursor: null as null | string});
  // const [{data, fetching, ...other}] = usePostsQuery({variables});
  const [{data, fetching}] = usePostsQuery({variables});
  
  const [,deletePost] = useDeletePostMutation();

  const [{data: meData}] = useMeQuery();

  if(!fetching && !data)
  {
    return <div>you got query failed for some reason</div>
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
            
            
            {meData?.me?.id !== p.creator.id ? null: <Box ml="auto">
              <NextLink href="/post/edit/[id]" as={`/post/edit/${p.id}`}>
                <IconButton
                  as={Link}
                  mr={4}
                  icon={<EditIcon/>}
                  aria-label="Edit Post"
                />
              </NextLink>              
              <IconButton               
                //colorScheme="orange"
                icon={<DeleteIcon/>}
                aria-label="Delete Post"
                onClick={() => {
                  deletePost({id: p.id});
                }}
              />
            </Box>}

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