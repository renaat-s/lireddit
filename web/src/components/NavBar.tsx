import { Box, Link, Flex, Button } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching},logout] = useLogoutMutation();
    const [{data,fetching}] = useMeQuery({
        pause: isServer(),
    });
    let body = null;
    
    
    if(fetching) {

    }
    else if(!data?.me) {
        body = (
            <>
            <NextLink href="/login">
                    <Link mr={2} color={'white'}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color={'white'}>register</Link>
                </NextLink>
            </>
        );
    }
    else {
        body = (
            <Flex>
            <Box mr={2} color={'white'}>{data.me.username}</Box>
            <Button 
                onClick={()=> {logout();}}
                isLoading={logoutFetching}
                variant='link' color={'snow'}>logout</Button>
            </Flex>
        );
    }

    return (
        <Flex bg="SlateGrey" p={4} >
            {                
            }
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}