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
        public IActionResult AddUser(UserDto user)
        {
            string username = _repo.AddUser(new Models.User
            {
                Username = user.Username,
                Password = user.Password,
                Phone = user.Phone
            });
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

        // GET api/users/isDriver/{userId}
        [HttpGet("users/isDriver/{userId}")]
        public IActionResult IsDriver(int userId)
        {
            User u = _repo.GetUser(userId);
            if (u == null)
            {
                return BadRequest("UserId does not exist");
            }
            try
            {
                if (u.Driver == null)
                {
                    return Ok(false);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);
            }
        }

        // POST api/users/review/{id}
        //* add a review to a user (UserId -- the user doing the review, reviewerId[insideReviewDto] -- the user being reviewed)
        [HttpPost("users/review/{userId}")]
        public IActionResult AddReviewToUser(int userId, ReviewDto reviewDto)
        {
            User u = _repo.GetUser(userId);
            if (u == null)
            {
                return BadRequest("UserId does not exist");
            }

            Review r = new Review
            {
                ReviewerId = reviewDto.ReviewerId,
                User = u,
                UserId = userId,
                ReviewText = reviewDto.ReviewText,
                Rating = reviewDto.Rating
            };

            if (reviewDto == null)
            {
                return BadRequest("Review object is null");
            }

            try
            {
                _repo.AddReviewToUser(userId, r);
                return Ok($"Review added to user {u.Username}");
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);
            }
        }

        // GET api/users/review/{id}
        //* get all reviews for a user
        [HttpGet("users/review/{userId}")]
        public ActionResult<List<OutReviewDto>> GetReviewsForUser(int userId)
        {
            User u = _repo.GetUser(userId);
            if (u == null)
            {
                return BadRequest("UserId does not exist");
            }

            try
            {
                List<Review> reviews = _repo.getIncomingReviewsForUser(userId);
                if(reviews == null || reviews.Count == 0)
                {
                    return Ok(new List<OutReviewDto>());
                }

                List<OutReviewDto> OutReviews = new List<OutReviewDto>();
                foreach (Review r in reviews)
                {
                    OutReviewDto outReview = new OutReviewDto
                    {
                        ReviewerName = _repo.GetUser(r.ReviewerId).Username,
                        ReviewText = r.ReviewText,
                        Rating = (int)r.Rating
                    };
                    OutReviews.Add(outReview);
                }
                return Ok(OutReviews);
            }
            catch (Exception ex)
            {
                // Handle exception and return an error response
                return BadRequest(ex.Message);
            }
        }

        // GET api/users/review-avd/{id}
        //* get average rating for a user
        [HttpGet("users/review-avg/{userId}")]
        public IActionResult GetAverageRatingForUser(int userId)
        {
            User u = _repo.GetUser(userId);
            if (u == null)
            {
                return BadRequest("UserId does not exist");
            }

            try
            {
                List<Review> reviews = _repo.getIncomingReviewsForUser(userId);
                if(reviews == null || reviews.Count == 0)
                {
                    return Ok(0);
                }

                return Ok(reviews.Average(r => r.Rating));
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

        // Preference Endpoints

        // POST api/AddPreference - create a new preference
        [HttpPost("AddPreference")]
        public ActionResult AddPreference(PreferenceDto preference)
        {
            if (preference.Category == null)
            {
                return BadRequest("Category is required");
            }
            if (preference.DriverId == 0)
            {
                return BadRequest("DriverId is required");
            }
            _repo.AddPreference(preference);
            return Ok("Success");
        }

        // GET api/GetPreference - get preference by id
        [HttpGet("GetPreference/{id}")]
        public ActionResult<Preference> GetPreference(long id)
        {
            Preference preference = _repo.GetPreference(id);
            if (preference == null)
            {
                return BadRequest($"Preference with id {id} does not exist");
            }
            return Ok(preference);
        }

        // Get api/UpdatePreference - update a preference
        [HttpPut("UpdatePreference")]
        public ActionResult UpdatePreference(Preference preference)
        {
            if (preference == null)
            {
                return BadRequest("Preference object is null");
            }
            var preferenceId = preference.Id;
            Preference oldPreference = _repo.GetPreference(preferenceId);
            if (oldPreference == null)
            {
                return BadRequest($"Preference with id {preferenceId} does not exist");
            }
            _repo.UpdatePreference(preference);
            return Ok();
        }

        // DELETE api/DeletePreference - delete a preference
        [HttpDelete("DeletePreference/{id}")]
        public ActionResult DeletePreference(long id)
        {
            Preference preference = _repo.GetPreference(id);
            if (preference == null)
            {
                return BadRequest($"Preference with id {id} does not exist");
            }
            _repo.DeletePreference(id);
            return Ok();
        }

        // GET api/GetPreferencesByDriverId/{driverId} - get all preferences by driver
        [HttpGet("GetPreferencesByDriverId/{driverId}")]
        public ActionResult<IEnumerable<Preference>> GetPreferencesByDriverId(long driverId)
        {
            IEnumerable<Preference> preferences = _repo.GetPreferencesByDriverId(driverId);
            if (preferences.Count() == 0)
            {
                return BadRequest($"No preferences exist for driver with id {driverId}");
            }
            return Ok(preferences);
        }

    }
}