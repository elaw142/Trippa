using Dtos;
using Models;

namespace Data
{
    public interface IRepo
    {
        //* Users Methods
        string AddUser(User user);
        User GetUser(long id);
        User[] GetAllUsers();

        // Methods to remove and add a driver to a user
        User AddDriverToUser(long userId, Driver driver);
        User RemoveDriverFromUser(long userId);
        Review AddReviewToUser(long userId, Review review);
        List<Review> getIncomingReviewsForUser(long userId);
        Driver getDriverUserId(long UserId);

        //* Trips Methods 
        Trip GetTrip(long id);
        Trip[] GetAllTrips();
        Trip[] SearchTrips(double? startLatitude, double? startLongitude, double? endLatitude, double? endLongitude, string date, string time, int seats);
        Trip[] GetAllTripsBy(long driverID);
        void DeleteTrip(long id);
        void UpdateTrip(UpdateTripDto trip);
        void AddTrip(TripDto tripDto);
        public Driver GetDriver(long driverId);
        public void AddPreference(PreferenceDto preference);
        Preference GetPreference(long id);
        Preference UpdatePreference(Preference updatedPreference);
        void DeletePreference(long id);
        IEnumerable<Preference> GetPreferencesByDriverId(long driverId);
    }
}