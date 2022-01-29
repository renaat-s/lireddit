import React from 'react'
import {Box} from '@chakra-ui/react'

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
    variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({children,variant = 'regular'}) => {
        return (
            <Box 
                w="100%" 
                maxW={variant === "regular" ? "800px": "400px" }
                mt={8} 
                mx="auto">                
                {children}
            </Box>
        );
}