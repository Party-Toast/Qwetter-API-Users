export interface Follow {
    follower_uuid: string;
    followee_uuid: string;
    date: string;
}

export interface FollowRequest {
    follower_uuid: string;
    followee_uuid: string;
    date: string
}

export interface UnfollowRequest {
    follower_uuid: string;
    followee_uuid: string;
}