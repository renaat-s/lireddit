import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number;
    creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId
}) => {
    const [,deletePost] = useDeletePostMutation();
    const [{data: meData}] = useMeQuery();
    
    if(meData?.me?.id !== creatorId) 
      {return null}

    return (        
            <Box>
              <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
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
                  deletePost({id});
                }}
              />
            </Box>

        );
}