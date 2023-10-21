- [x] Name of the project.
- [ ] A link to your Project Management tool.
- [x] A short description of what the project is about. (You may put a link to your final report here, after it has been completed).
- [x] Technologies that are used to build the project (include the languages used, the libraries and their versions).
- [x] Instructions on how to install and setup the project (specify all dependencies).
- [ ] Usage Examples (if available).
- [ ] URL of the website where the project has been deployed (if applicable).
- [ ] Future Plan (Ideas for future releases)
- [ ] Acknowledgements (if any) - You can list tutorials used, projects referred to, people consulted etc.

# Datadons-Carpooling

This repository contains the source code for the Datadons frontend and backend carpooling system.

## Getting Started

To set up and run the Datadons app and backend on your local machine, follow these steps:

1. Clone this repository.
2. Navigate to the `datadons-app` folder and execute `npm install` to install all necessary app dependencies.
3. Run `npm start` to launch the app.
4. In a separate terminal, navigate to the `datadons-backend` folder.
5. Execute `dotnet run` to initiate the backend.

## Features

The Datadons application facilitates the following:

- **User Management**: Authenticate and authorise users.
- **Data Handling**: Manage and store user and trip data efficiently.
- **API Integration**: Robust endpoints for fetching, updating, and manipulating data.
- **Trip Management**: Users can view a list of available trips, and if registered as a driver, can add new trips.
- **Communication**: A live messaging system enabling seamless communication between users.
- **Search**: Integrated searching functionality, allowing users to find the most suitable trip based on the location criteria.

## Technologies Used

- **Frontend**: React Native
- **Backend**: .NET Core
- **Deployment**: Azure

## Folder Structure

Within the `src` directory "datadons-backend", the organisation is as follows:

- `controllers`: Handles API calls and HTTP request management.
- `models`: Structures for database interaction.
- `data`: Utility functions (idk what to write here tbh ).
- `dtos`: Functions assisting in data manipulation and shaping, as needed.

## Future Plans

#TODO

## Acknowledgements

#TODO

## License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.
