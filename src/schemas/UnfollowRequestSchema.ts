const schema = {
    "type": "object",
    "properties": {
        "followerUuid": {
            "type": "string"
        },
        "followeeUuid": {
            "type": "string"
        }
    },
    "required": [
        "followeeUuid",
        "followerUuid"
    ]
} as const;
export default schema;