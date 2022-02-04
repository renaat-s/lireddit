import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

export const EditPost = ({}) => {
    const router = useRouter();
    const intId = useGetIntId();
    const {data, loading} = usePostQuery(
        {
            skip: intId === -1,
            variables:{
                id: intId
            }
        });
    const [updatePost] = useUpdatePostMutation();

    if(loading){
        <Layout>Loading...</Layout>
    }

    if(!data?.post){
        return <Layout>
            Could not find post.
        </Layout>
    }


    return (
        <Layout variant="small">
            <Formik
        initialValues={{ title: data.post.title, text: data.post.text}}
        onSubmit={async (values,) => {            
            await updatePost({variables: {id: intId, ...values}})
            // router.push('/');
            router.back();
        }}
        >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
                
              />
            </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal">
                Update Post
              </Button>              
          </Form>
        )}
      </Formik>    
        </Layout>
        );
}

export default withApollo({ssr:false})(EditPost);