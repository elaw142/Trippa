using Microsoft.AspNetCore.Mvc;
using Data;
using Models;
using Dtos;


namespace Controllers
{
    // TODO: beautify endpoints, eg error handling, better return values
    // localHost:8080/api
    [Route("api")]
    [ApiController]
    public class DonsController : Controller
    {
        private readonly IRepo _repo;
        public DonsController(IRepo repo)
        {
            _repo = repo;
        }

        //* General Endpoints

        // GET api/GetVersion
        [HttpGet("GetVersion")]
        public ActionResult<string> GetVersion()
        {
            return Ok("0.0.2 (TESTING PHASE)");
        }



        //* User Endpoints

        // POST api/AddUser
        [HttpPost("AddUser")]
        public IActionResult AddUser(User user)
        {
            string username = _repo.AddUser(user);
            return new CreatedResult($"/api/GetUser/{username}", user);
        }

        // GET api/GetUser
        [HttpGet("GetUser/{id}")]
        public ActionResult<User> GetUser(long id)
        {
            if (_repo.GetUser(id) == null)
            {
                return BadRequest($"User with id {id} does not exist");
            }
            return Ok(_repo.GetUser(id));
        }

        // GET api/GetAllUsers
        [HttpGet("GetAllUsers")]
        public ActionResult<User[]> GetAllUsers()
        {
            if (_repo.GetAllUsers().Length == 0)
            {
                return BadRequest("No users exist");
            }
            return Ok(_repo.GetAllUsers());
        }

        // POST api/users/AddDriver/{id}
        [HttpPost("users/AddDriver/{userId}")]
        public IActionResult AddDriverToUser(int userId, DriverDto driverDto)
        {
            User u = _repo.GetUser(userId);
            if (u == null)
            {
                return BadRequest("UserId does not exist");
            }

            Driver d = new Driver
            {
                UserId = userId,
                User = u,
                LicenseNumber = driverDto.LicenseNumber,
                Car = new Car
                {
                    Make = driverDto.CarMake,
                    Type = driverDto.CarType,
                    Model = driverDto.CarModel,
                    Color = driverDto.CarColor,
                    LicensePlate = driverDto.PlateNumber
                }
            };

            if (driverDto == null)
            {
                return BadRequest("Driver object is null");
            }

            try
            {
                _repo.AddDriverToUser(userId, d);
                return Ok($"Driver added to user {u.Username}");
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/users/driver/{userId}
        [HttpDelete("users/deleteDriver/{userId}")]
        public IActionResult RemoveDriverFromUser(int userId)
        {
            User u = _repo.GetUser(userId);
            if (u == null)
            {
                return BadRequest("UserId does not exist");
            }
            try
            {
                _repo.RemoveDriverFromUser(userId);
                return Ok($"Driver removed from user {u.Username}");
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);
            }
        }

        //* Trip Endpoints

        // GET api/GetTrip - get trip by id
        [HttpGet("GetTrip/{id}")]
        public ActionResult<Trip> GetTrip(long id)
        {
            Trip trip = _repo.GetTrip(id);
            if (trip == null)
            {
                return BadRequest($"Trip with id {id} does not exist");
            }
            return Ok(trip);
        }

        // GET api/GetAllTrips - get all trips
        [HttpGet("GetAllTrips")]
        public ActionResult<IEnumerable<Trip>> GetAllTrips()
        {
            IEnumerable<Trip> trips = _repo.GetAllTrips();
            if (trips == null)
            {
                return Ok("No trips exist");
            }
            return Ok(trips);
        }

        // POST api/AddTrip - create a new trip
        [HttpPost("AddTrip")]
        public ActionResult<TripDto> AddTrip(TripDto trip)
        {
            if (trip.DriverID == 0)
            {
                return BadRequest("DriverID is required");
            }
            if (trip.DateTime == null)
            {
                return BadRequest("DateTime is required");
            }
            if (trip.MaxRiders == 0)
            {
                return BadRequest("MaxRiders is required");
            }
            if (trip.Price == 0)
            {
                return BadRequest("Price is required");
            }
            if (trip.StartLatitude == 0)
            {
                return BadRequest("StartLatitude is required");
            }
            if (trip.StartLongitude == 0)
            {
                return BadRequest("StartLongitude is required");
            }
            if (trip.EndLatitude == 0)
            {
                return BadRequest("EndLatitude is required");
            }
            if (trip.EndLongitude == 0)
            {
                return BadRequest("EndLongitude is required");
            }
            if (trip.DetourRange == 0)
            {
                return BadRequest("DetourRange is required");
            }
            _repo.AddTrip(trip);
            return Ok("Success");
        }

        // PUT api/UpdateTrip - update a trip
        [HttpPut("UpdateTrip")]
        public ActionResult UpdateTrip(UpdateTripDto trip)
        {
            if (trip == null)
            {
                return BadRequest("Trip object is null");
            }
            var tripId = trip.TripID;
            Trip oldtrip = _repo.GetTrip(tripId);
            if (oldtrip == null)
            {
                return BadRequest($"Trip with id {tripId} does not exist");
            }
            var driverId = trip.DriverID;
            Driver driver = _repo.GetDriver(driverId);
            if (driver == null)
            {
                return BadRequest($"Driver with id {driverId} does not exist");
            }
            _repo.UpdateTrip(trip);
            return Ok();
        }

        // DELETE api/DeleteTrip - delete a trip
        // TODO - I think we should also check if the person trying to delete the trip is the driver
        [HttpDelete("DeleteTrip/{id}")]
        public ActionResult DeleteTrip(long id)
        {
            Trip trip = _repo.GetTrip(id);
            if (trip == null)
            {
                return BadRequest($"Trip with id {id} does not exist");
            }
            _repo.DeleteTrip(id);
            return Ok();
        }

        // GET api/GetAllTripsBy/{driverID} - get all trips by user
        [HttpGet("GetAllTripsBy/{driverID}")]
        public ActionResult<IEnumerable<Trip>> GetAllTripsBy(long driverID)
        {
            IEnumerable<Trip> trips = _repo.GetAllTripsBy(driverID);
            if (trips.Count() == 0)
            {
                return BadRequest($"No trips exist for driver with id {driverID}");
            }
            return Ok(trips);
        }

        // GET api/Trips/search - Retrieve trips based on certain criteria like start and end GPS locations, whether the trip is full, date and time range, etc.
        // Not sure how to test this
        [HttpGet("Trips/search")]
        public ActionResult<IEnumerable<Trip>> SearchTrips([FromQuery] double? startLatitude, [FromQuery] double? startLongitude, [FromQuery] double? endLatitude, [FromQuery] double? endLongitude, [FromQuery] string date, [FromQuery] string time, [FromQuery] int seats)
        {
            IEnumerable<Trip> trips = _repo.SearchTrips(startLatitude, startLongitude, endLatitude, endLongitude, date, time, seats);
            if (trips == null)
            {
                return BadRequest($"No trips exist for the given criteria");
            }
            return Ok(trips);
        }
    }
}