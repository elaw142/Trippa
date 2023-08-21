## Running

To run the backend, run the following commands:

- insure you are in the datadons-backend directory `cd datadons-backend`

```sh
dotnet run
```

for swagger visit `https://localhost:5001/swagger`

## DB instructs

When changing models and contexts run the following commands:

```sh
dotnet ef migrations add MyNewChanges
dotnet ef database update
```

this changes the database to match the new models and contexts.

## Testing with Swagger

- Setting self as driver

```c++
// Create a api call POST request that sets the driver with userid like this
[HttpPost("setDriver/{userId}")]
public ActionResult<User> SetDriver(long userId, Driver driver){
    var user = _repo.AddDriverToUser(userId, driver);
    if(user == null){
        return NotFound("User with this userId is not found");
    }
    return Ok(user);
}
```
