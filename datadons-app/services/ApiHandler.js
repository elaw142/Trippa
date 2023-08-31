const baseUrl = "http://localhost:5107/api/"


function getJson(path) {
    return fetch(baseUrl + path)
        .then(res => res.json())
}

function post(path, data) {
    return fetch(baseUrl + path, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
}

function getVersion() {
    return fetch(baseUrl + "GetVersion")
        .then(res => res.text())
}

function addUser(user) {
    return post("AddUser", user)
}

function getAllUsers() {
    return getJson("GetAllUsers")
}

function getUser(id) {
    return getJson("GetUser/" + id)
}

export { 
    getJson, 
    post,
    getVersion,
    addUser,
    getAllUsers,
    getUser
}