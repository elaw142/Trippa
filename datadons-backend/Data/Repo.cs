using Models;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using Dtos;

namespace Data
{
    public class Repo : IRepo
    {
        private readonly DonsDbContext _repo;

        public Repo(DonsDbContext repo)
        {
            _repo = repo;
        }

        //* Users Methods
        public string AddUser(User user)
        {
            _repo.Users.Add(user);
            _repo.SaveChanges();
            return user.Username;
        }

        public User GetUser(long id)
        {
            return _repo.Users.FirstOrDefault(u => u.Id == id);
        }

        public User[] GetAllUsers()
        {
            User[] c = _repo.Users.ToArray();
            return c;
        }

        public User AddDriverToUser(long userId, Driver driver)
        {
            var user = _repo.Users.Include(u => u.Driver).FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.Driver = driver;
                _repo.SaveChanges();
            }
            return user;
        }

        public User RemoveDriverFromUser(long userId)
        {
            var user = _repo.Users.Include(u => u.Driver).FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.Driver = null;
                _repo.SaveChanges();
            }
            return user;
        }

        public Review AddReviewToUser(long userId, Review review)
        {
            var user = _repo.Users.Include(u => u.IncomingReviews).FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.IncomingReviews.Add(review);
                _repo.SaveChanges();
            }
            return review;
        }








        //* Trips Methods
        public Trip GetTrip(long id)
        {
            return _repo.Trips.FirstOrDefault(t => t.TripID == id);
        }
        public Trip[] GetAllTrips()
        {
            return _repo.Trips.ToArray();
        }

        public Trip[] SearchTrips(double? startLatitude, double? startLongitude, double? endLatitude, double? endLongitude, string dateStr, string timeStr, int seats)
        {
            IQueryable<Trip> query = _repo.Trips.Include(t => t.StartPoint).Include(t => t.EndPoint);

            // Filter for start location
            if (startLatitude.HasValue && startLongitude.HasValue)
            {
                // Assuming you want to find exact matches
                query = query.Where(t => t.StartPoint.Latitude == startLatitude.Value && t.StartPoint.Longitude == startLongitude.Value);
            }

            // Filter for end location
            if (endLatitude.HasValue && endLongitude.HasValue)
            {
                query = query.Where(t => t.EndPoint.Latitude == endLatitude.Value && t.EndPoint.Longitude == endLongitude.Value);
            }

            // Filter for date
            if (DateTime.TryParse(dateStr, out DateTime searchDate))
            {
                query = query.Where(t => t.DateTime.Date == searchDate.Date);
            }

            // Filter for time 
            if (!string.IsNullOrWhiteSpace(timeStr))
            {
                var parts = timeStr.Split(':');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0], out int hours) &&
                    int.TryParse(parts[1], out int minutes))
                {
                    DateTime searchTime = new DateTime(1, 1, 1, hours, minutes, 0); // Using a dummy date here
                    query = query.Where(t => t.DateTime.TimeOfDay == searchTime.TimeOfDay);
                }
            }

            // Filter for the available seats
            query = query.Where(t => t.MaxRiders - t.CurrentRiders.Count >= seats);

            return query.ToArray();
        }

        public Trip[] GetAllTripsBy(long driverId)
        {
            return _repo.Trips.Where(t => t.DriverID == driverId).ToArray();
        }
        public void DeleteTrip(long id)
        {
            var tripToDelete = _repo.Trips.FirstOrDefault(t => t.TripID == id);
            if (tripToDelete != null)
            {
                _repo.Trips.Remove(tripToDelete);
                _repo.SaveChanges();
            }
        }
        public void UpdateTrip(UpdateTripDto trip)
        {
            Trip newTrip = new Trip
            {
                TripID = trip.TripID,
                DriverID = trip.DriverID,
                DateTime = trip.DateTime,
                MaxRiders = trip.MaxRiders,
                Price = trip.Price,
                StartPoint = new GPS
                {
                    Latitude = trip.StartLatitude,
                    Longitude = trip.StartLongitude
                },
                EndPoint = new GPS
                {
                    Latitude = trip.EndLatitude,
                    Longitude = trip.EndLongitude
                },
                DetourRange = trip.DetourRange
            };

            _repo.Trips.Update(newTrip);
            _repo.SaveChanges();
        }
        public void AddTrip(TripDto tripDto)
        {
            Trip newTrip = new Trip
            {
                DriverID = tripDto.DriverID,
                DateTime = tripDto.DateTime,
                MaxRiders = tripDto.MaxRiders,
                Price = tripDto.Price,
                StartPoint = new GPS
                {
                    Latitude = tripDto.StartLatitude,
                    Longitude = tripDto.StartLongitude
                },
                EndPoint = new GPS
                {
                    Latitude = tripDto.EndLatitude,
                    Longitude = tripDto.EndLongitude
                },
                DetourRange = tripDto.DetourRange
            };
            _repo.Trips.Add(newTrip);
            _repo.SaveChanges();
        }
        public Driver GetDriver(long driverId)
        {
            return _repo.Drivers.FirstOrDefault(d => d.Id == driverId);
        }

        public void AddPreference(PreferenceDto preference)
        {
            Preference newPreference = new Preference{
                Category = preference.Category,
                Description = preference.Description,
                DriverId = preference.DriverId
            };
            if (preference != null)
            {
                _repo.Preferences.Add(newPreference);
                _repo.SaveChanges();
            }

        }
        public Preference GetPreference(long id)
        {
            return _repo.Preferences.FirstOrDefault(p => p.Id == id);
        }
        public Preference UpdatePreference(Preference updatedPreference)
        {
            var preference = _repo.Preferences.FirstOrDefault(p => p.Id == updatedPreference.Id);
            if (updatedPreference != null)
            {
                preference.Category = updatedPreference.Category;
                preference.Description = updatedPreference.Description;
                preference.DriverId = updatedPreference.DriverId;
                _repo.SaveChanges();
            }
            return preference;
        }
        public void DeletePreference(long id)
        {
            var preferenceToDelete = _repo.Preferences.FirstOrDefault(p => p.Id == id);
            if (preferenceToDelete != null)
            {
                _repo.Preferences.Remove(preferenceToDelete);
                _repo.SaveChanges();
            }
        }
        public IEnumerable<Preference> GetPreferencesByDriverId(long driverId)
        {
            return _repo.Preferences.Where(p => p.DriverId == driverId).ToArray();
        }
    }
}