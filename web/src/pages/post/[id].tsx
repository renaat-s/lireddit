import { Box, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from '../../components/Layout';
import { createUrlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFormUrl';


export const Post = ({}) => {  
    const [{data,fetching}] = useGetPostFromUrl();
    
    if(fetching){
        return (<Layout>Loading...<div></div></Layout>);
    }

    if(!data?.post){
        return <Layout>
            <div> Could not find post.</div>
        </Layout>
    }

    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading> 
            <Box mb={4}>
            <Text>{data.post.text}</Text>
            </Box>
            <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
        </Layout>
    );
}

export default withUrqlClient(createUrlClient, {ssr:true}) (Post);