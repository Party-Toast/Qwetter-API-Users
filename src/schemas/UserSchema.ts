const schema = {
    "type": "object",
    "properties": {
        "uuid": {
            "type": "string"
        },
        "username": {
            "type": "string"
        },
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "avatar": {
            "type": "string"
        },
        "bio": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "website": {
            "type": "string"
        }
    },
    "required": [
        "avatar",
        "bio",
        "firstName",
        "lastName",
        "location",
        "username",
        "uuid",
        "website"
    ]
} as const;
export default schema;