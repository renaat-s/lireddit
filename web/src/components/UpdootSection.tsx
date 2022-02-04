import { ApolloCache } from '@apollo/client';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Flex, Box, IconButton,Text } from '@chakra-ui/react';
import { gql } from 'graphql-tag';
import React, { useState } from 'react'
import {PostSnippetFragment, useVoteMutation, VoteMutation} from '../generated/graphql'

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
    
                        
        const data = cache.readFragment<{
            id: number;
            points: number;
            voteStatus: number | null;
        }>({
            id: 'Post:'+ postId ,
            fragment: gql`
              fragment _ on Post {
                id
                points
                voteStatus
              }`,
        });

        if(data){
            if(data.voteStatus === value){
              return;
            }
            const newPoints = (data.points as number) + (!data.voteStatus? 1 : 2)*(value);
            cache.writeFragment(
            {
                id: "Post:"+postId,
                fragment:
              gql`
                fragment __ on Post {
                  points
                  voteStatus
                }
              `,
              data: { points: newPoints, voteStatus: value}
            });
          }
}


export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>("not-loading");
    const [vote] = useVoteMutation();   
    // console.log("postId: ",post.id, "voteStatus: ",post.voteStatus);
    return (
        <Flex direction="column" justify="center" justifyContent="center" alignItems="center" mr={4}>
        <Box>
            <IconButton aria-label="updoot" icon={<ArrowUpIcon/>} fontSize ="22px" onClick={ async() => {
                if(post.voteStatus ===1){return ;}
                setLoadingState('updoot-loading');
                await vote({
                    variables:
                    {
                    postId: post.id,
                    value: 1
                    },
                    update: (cache) => updateAfterVote(1, post.id, cache)
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
                    variables:{
                        postId: post.id,
                        value: -1
                    } ,
                    update: (cache) => updateAfterVote(-1, post.id, cache)                   
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