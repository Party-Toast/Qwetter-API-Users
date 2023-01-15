const schema = {
    "type": "object",
    "properties": {
        "follower_uuid": {
            "type": "string"
        },
        "followee_uuid": {
            "type": "string"
        },
        "date": {
            "type": "string"
        }
    },
    "required": [
        "date",
        "followee_uuid",
        "follower_uuid"
    ]
} as const;
export default schema;