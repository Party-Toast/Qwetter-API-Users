const schema = {
    "type": "object",
    "properties": {
        "follower_uuid": {
            "type": "string"
        },
        "followee_uuid": {
            "type": "string"
        }
    },
    "required": [
        "followee_uuid",
        "follower_uuid"
    ]
} as const;
export default schema;