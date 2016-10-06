import React, { Component } from 'react';
import { render } from 'react-dom';
import { Container } from 'flux/utils';
import Autosuggest from 'react-autosuggest-legacy';
import AirportStore from './stores/AirportStore';
import RouteStore from './stores/RouteStore';
import TicketStore from './stores/TicketStore';
import AirportActionCreators from './actions/AirportActionCreators';
import TicketItem from './components/TicketItem';

class App extends Component {
  getSuggestions(input, callback) {
    const escapendInput = input.trim().toLowerCase();
    const airportMatchRegex = new RegExp('\\b' + escapendInput, 'i');
    const suggestions = this.state.airports
      .filter(airport => airportMatchRegex.test(airport.city))
      .sort((airport1, airport2) => {
        return airport1.city.toLowerCase().indexOf(escapendInput) - 
        airport2.city.toLowerCase().indexOf(escapendInput)
      })
      .slice(0, 7)
      .map(airport => `${airport.city} = ${airport.country} (${airport.code})`);
    callback(null, suggestions);
  }

  handleSelect(target, suggestion, event) {
    const airportCodeRegex = /\(([^)]+)\)/;
    let airportCode = airportCodeRegex.exec(suggestion)[1];
    AirportActionCreators.chooseAirport(target, airportCode);
  }

  componentDidMount() {
    AirportActionCreators.fetchAirports();
  }

  componentWillUpdate(nextProps, nextState) {
    let originAndDestinationSelected = 
      nextState.origin && nextState.destination;
    
    let selectionHasChangedSinceLastUpdate = 
      nextState.origin !== this.state.origin ||
      nextState.destination !== this.state.destination;
    
    if (originAndDestinationSelected && selectionHasChangedSinceLastUpdate) {
      AirportActionCreators.fetchTickets(nextState.origin,
                                         nextState.destination);
    }
  }

  render() {

    let ticketList = this.state.tickets.map((ticket) => (
      <TicketItem key={ticket.id} ticket={ticket} />
    ));

    return (
      <div>
        <header>
          <div className="header-brand">
            <p>Check discount ticket prices and pay using your AirCheap points</p>
          </div>
          <div className="header-route">
            <Autosuggest id='origin'
                         suggestions={this.getSuggestions.bind(this)}
                         onSuggestionSelected={this.handleSelect.bind(this, 'origin')}
                         inputAttributes={{placeholder: 'From'}} />
            <Autosuggest id='destination'
                         suggestions={this.getSuggestions.bind(this)}
                         onSuggestionSelected={this.handleSelect.bind(this, 'destination')}
                         inputAttributes={{placeholder: 'To'}} />
          </div>
          <div style={{clear: 'both'}}></div>
          <div>
            {ticketList}
          </div>
        </header>
      </div>
    );
  }
}

App.getStores = () => ([AirportStore, RouteStore, TicketStore]);
App.calculateState = (prevState) => ({
  airports: AirportStore.getState(),
  origin: RouteStore.get('origin'),
  destination: RouteStore.get('destination'),
  tickets: TicketStore.getState()
});

const AppContainer = Container.create(App);

render(<AppContainer />, document.getElementById('root'));