import { Box, Link, Flex, Button, Heading } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import {useRouter} from 'next/router';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
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
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button as={Link} mr={4}>create post</Button>
                </NextLink>    

                <Box mr={2} color={'white'}>{data.me.username}</Box>
                <Button 
                    onClick={async ()=> {
                        await logout();
                        router.reload();                    }}
                    isLoading={logoutFetching}
                    variant='link' color={'snow'}>logout</Button>
            </Flex>
        );
    }

    return (
        <Flex bg="SlateGrey" p={4} position="sticky" top={0} zIndex={2}>
            <Flex maxW={800} flex={1} align="center" m="auto">
            <NextLink href="/"><Link><Heading textColor="white" >LiReddit</Heading></Link></NextLink>
            <Box ml={'auto'}>
                {body}
            </Box>
            </Flex>            
        </Flex>
    );
}