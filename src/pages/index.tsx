import { fetch } from 'src/shared/utils/fetch';

export const getServerSideProps: GetServerSideProps<THomeProps> = async () => {
    const blogPosts = await fetch('/api/blog-posts');
    return { props: { blogPosts } };
};
