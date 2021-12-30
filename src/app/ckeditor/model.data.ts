interface Document {
    _id: string,
    name: string,
    content: string
}

interface Data {
    data: string
}


interface UserDocs {
    _id: string,
    allowed_users: [string]
}

interface User {
    _id: string,
    name: string,
    email: string,
    password: string,
    docs: Array<UserDocs>
}



export {Data, User, Document}