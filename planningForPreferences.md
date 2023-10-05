1. Make a button called "Set Preferences" on the add trips page that goes to the preferences 
2. The button then opens a drop down list that users can scroll through, and then the options will be "No pets", "No luggage", and etc. 
3. Make sure that it then sends to the api AddPreference
```
[HttpPost("addPrefToTrip")]
public ActionResult<PreferenceForTripDTO> AddPreferenceToTrip([FromBody] PreferenceForTripDTO preferenceDto)
{
    var preference = new Preference
    {
        NoPets = preferenceDto.NoPets,
        NoLuggage = preferenceDto.NoLuggage,
        NoFood = preferenceDto.NoFood,
        NoDrinks = preferenceDto.NoDrinks,
        NoSmoking = preferenceDto.NoSmoking,
        TripId = preferenceDto.TripId
    };
    var tripId = preferenceDto.TripId;
    var preferenceFromTripId = _repo.GetPreferenceByTripId((int)tripId);
    if (preferenceFromTripId != null)
    {
        return BadRequest($"Preference already exists for trip with id {tripId}");
    }
    var addedPreference = _repo.AddPreferenceToTrip(preferenceDto.TripId, preference);
    if (addedPreference == null)
    {
        return BadRequest("Failed to add the preference.");
    }
    return Ok(addedPreference);
}
```
