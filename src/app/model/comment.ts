export interface CommentResponse {
    comments: CommentReq[];
    total: number;
    skip: number;
    limit: number;
}
export interface CommentReq {
    id: number;
    body: string;
    postId: number;
    likes: number;
    user: UserReq;
}
export interface UserReq {
    id: number;
    username: string;
    fullName: string;
}
