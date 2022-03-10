export declare class AppService {
    getBlogPosts(): import("rxjs").Observable<{
        title: string;
        id: number;
    }[]>;
    getBlogPost(postId: number): import("rxjs").Observable<{
        title: string;
        id: number;
    }>;
}
