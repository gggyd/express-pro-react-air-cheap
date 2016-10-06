import 'whatwg-fetch';
import AirportActionCreators from '../actions/AirportActionCreators';

let AirCheapAPI = {
  fetchAirports() {
    return fetch('airports.json')
    .then((response) => response.json());
    // .then((responseData) => {
    //   AirportActionCreators.fetchAirportsSuccess(responseData);
    // })
    // .catch((error) => {
    //   AirportActionCreators.fetchAirportsError(error);
    // })
  },

  fetchTickets(origin, destination) {
    return fetch('flights.json')
    .then((response) => response.json());
    // .then((responseData) => {
    //   AirportActionCreators.fetchTicketsSuccess(responseData);
    // })
    // .catch((error) => {
    //   AirportActionCreators.fetchTicketsError(error);
    // });
  }
};

export default AirCheapAPI;