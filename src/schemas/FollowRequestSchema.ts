const schema = {
    "type": "object",
    "properties": {
        "followerUuid": {
            "type": "string"
        },
        "followeeUuid": {
            "type": "string"
        },
        "date": {
            "type": "string"
        }
    },
    "required": [
        "date",
        "followeeUuid",
        "followerUuid"
    ]
} as const;
export default schema;