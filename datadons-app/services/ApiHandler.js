// const baseUrl = "http://localhost:5107/api/";
const baseUrl = "https://datadons2.azurewebsites.net/api/";

function getJson(path) {
  return fetch(baseUrl + path)
    .then(async (res) => {
      if (!res.ok) {
        const responseText = await res.text();
        throw new Error(
          `HTTP error! Status: ${res.status}. Response: ${responseText}`
        );
      }
      return res.json();
    })
    .catch((error) => {
      throw new Error(`Network error: ${error.message}`);
    });
}

function post(path, data) {
  return fetch(baseUrl + path, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        return res.text();
      }
    })
    .then((response) => {
      console.log("Raw Response from POST:", response);
      return response;
    })
    .catch((error) => {
      console.error("Error in POST:", error);
      throw error;
    });
}

function getVersion() {
  return fetch(baseUrl + "GetVersion").then((res) => res.text());
}

function getUserName(userName) {
  return fetch(baseUrl + "GetUserByUsername/" + userName)
    .then((res) => {
      if (res.status === 404) {
        return `User with username ${userName} does not exist.`;
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      throw error;
    });
}

function getUserId(userName) {
  return fetch(baseUrl + "GetIdByUsername/" + userName)
    .then((res) => {
      if (res.status === 404) {
        return `User with username ${userName} does not exist.`;
      }
      return res.text();
    })

    .catch((error) => {
      console.error("Error fetching user:", error);
      throw error;
    });
}

function AddUser(user) {
  return post("AddUser", user);
}

function getAllTrips() {
  return getJson("GetAllTripsOut");
}

function AddDriver(userId, driver) {
  return post("users/AddDriver/" + userId, driver);
}

function AddTrip(trip) {
  return post("AddTrip", trip);
}

function getDriverByUserId(userId) {
  return fetch(baseUrl + "GetDriverByUserId/" + userId);
}

function GetDriverIdByUserId(userId) {
  return fetch(baseUrl + "GetDriverIdByUserId/" + userId)
    .then(async (response) => {
      // console.log("response:", response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      // console.log("responseData:", responseData);
      return responseData;
    })
    .catch((error) => {
      // console.error("Error fetching driver ID:", error);
      throw error;
    });
}

function AddPreferenceToTrip(preference) {
  console.log("Sending preferences:", preference);
  return post("addPrefToTrip", preference);
}

export {
  getJson,
  post,
  getVersion,
  getUserName,
  getUserId,
  AddUser,
  getAllTrips,
  AddDriver,
  AddTrip,
  getDriverByUserId,
  GetDriverIdByUserId,
  AddPreferenceToTrip,
};
