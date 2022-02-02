import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Flex, Box, IconButton,Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import {PostSnippetFragment, useVoteMutation} from '../generated/graphql'

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>("not-loading");
    const [,vote] = useVoteMutation();   
    console.log("postId: ",post.id, "voteStatus: ",post.voteStatus);
    return (
        <Flex direction="column" justify="center" justifyContent="center" alignItems="center" mr={4}>
        <Box>
            <IconButton aria-label="updoot" icon={<ArrowUpIcon/>} fontSize ="22px" onClick={ async() => {
                if(post.voteStatus ===1){return ;}
                setLoadingState('updoot-loading');
                await vote({
                    postId: post.id,
                    value: 1
                });
                setLoadingState('not-loading');
            }}            
            colorScheme={post.voteStatus ===1 ? "green" : undefined}
            isLoading={loadingState==='updoot-loading'}
            />
        </Box>          
        <Box><Text fontSize={22}>{post.points}</Text></Box>        
        <Box>
            <IconButton aria-label="downdoot" icon={<ArrowDownIcon/>} fontSize ="22px" onClick={ async() => {
                if(post.voteStatus ===-1){return ;}
                setLoadingState('downdoot-loading');
                await vote({
                    postId: post.id,
                    value: -1
                })
                setLoadingState('not-loading');
            }}
            colorScheme={post.voteStatus ===-1 ? "red" : undefined}
            isLoading={loadingState==='downdoot-loading'}
            />
        </Box>
      </Flex>
      );
}