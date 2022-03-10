import { fetch } from 'src/shared/utils/fetch';

export const getServerSideProps: GetServerSideProps<TBlogProps> = async () => {
    const id = ctx.query.id;
    const post = await fetch(`/api/blog-posts/${id}`);

    return { props: { post } };
};
