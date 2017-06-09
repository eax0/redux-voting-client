import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import reducer from './reducer';
import {setState} from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import App from './components/App';
import {VotingContainer} from './components/Voting';
import {ResultsContainer} from './components/Results';

const socket = io(`${location.protocol}//${location.hostname}:8090`);

// при изменении состояния на сервере - обновляем состояние клиента
socket.on('state', state => {
    store.dispatch(setState(state))
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(remoteActionMiddleware(socket))
));

const routes = <Route component={App}>
    <Route path="/" component={VotingContainer}/>
    <Route path="/results" component={ResultsContainer}/>
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('app')
);
