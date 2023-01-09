export interface Follow {
    followerUuid: string;
    followeeUuid: string;
    date: string;
}

export interface FollowRequest {
    followerUuid: string;
    followeeUuid: string;
    date: string
}

export interface UnfollowRequest {
    followerUuid: string;
    followeeUuid: string;
}