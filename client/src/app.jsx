var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var RouteHandler =  ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;
var ViewAllMessages = require('./viewAllMessages');
var TopBar = require('./topbar');
var InputBox = require('./inputbox');
var Firebase = require('firebase');
var Home = require('./home');

var getCookies = function(){
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i=0; i<pairs.length; i++){
    pairs
    var pair = pairs[i].trim().split("=");
    cookies[pair[0]] = unescape(pair[1]);
  }
  return cookies;
}

var cookies = getCookies();
var token = document.token = cookies.token;
var auth = document.auth = cookies.auth;

var App = React.createClass({
  render: function(){
    return (
      <div>
        <TopBar/>
        <RouteHandler/>
      </div>
    );
  }
});

var mainView = React.createClass({
  mixins: [ReactRouter.Navigation],
  messages: [],
  getInitialState: function(){
    return {
      messages: '',
      sort: 'recent',
      roomname: this.props.params.roomname,
      token: '',
      auth: '',
      sessions: ''
    };
  },

  // Retrieve the messages data from Firebase
  componentWillMount: function(){
    var self = this;
    var roomname = this.state.roomname;
    console.log('ROOM',this.state.roomname)
    if(token){
      var context = this;
      this.firebaseRef = new Firebase('https://donkey.firebaseio.com/');
      this.firebaseRef.authWithCustomToken(token, function(error, authData){
        if(error){
          console.log('Problem connecting to Database');
          console.log(error);
        } else{
          $.ajax({
            type: "POST",
            url: "checkroom",
            contentType: "application/json",
            data: JSON.stringify({roomname: roomname}),
            success: function(response){
              console.log(response);
              if (response) {
                console.log('Connected to Database')
                console.log(authData);
                context.setState({
                  token: authData.token,
                  auth: authData.auth,
                });
              } else {
                console.log('room does not exists');
                // console.log(Router);
                self.transitionTo('index');
                console.log(self);
              }
              
            }
          });
        }
      })
      this.messageRef = this.firebaseRef.child(roomname);
      this.messageRef.on('value', function(dataSnapshot){
        this.messages.push(dataSnapshot.val());
        this.setState({
          messages: dataSnapshot.val()
        });
        console.log('inFreshPost', dataSnapshot.val())
      }.bind(this));

      this.sessionsRef = this.firebaseRef.child('sessions');
      this.sessionsRef.on('value', function(dataSnapshot){
        this.messages.push(dataSnapshot.val());
        this.setState({
          sessions: dataSnapshot.val()
        });
      // console.log('SESSSSSSSSSSSSSSSSionREF', this.sessionRef.toString())
        console.log('inSession', dataSnapshot.val())
      }.bind(this));
    }
  },

  handleSortRecent: function(){
    this.setState({sort: 'recent'});
  },
  handleSortPopular: function(){
    this.setState({sort: 'popular'});
  },
  handleFavorites: function(){
    this.setState({sort: 'favorites'});
  },
  handleMyPosts: function(){
    this.setState({sort: 'myPosts'});
  },
  toggleInputBox: function(){
    this.setState({ input: !this.state.input })
  },
  render: function(){
    return (
      <div>
        <div>
          <div style={this.styles.filter}>
            <div className="btn-group" style={{display: 'inline-block'}}>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={ this.handleSortRecent }> New </button>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={ this.handleSortPopular }> Hot </button>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={ this.handleFavorites }>Favorites</button>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={ this.handleMyPosts }>My Posts</button>
            </div>
            <InputBox token={ this.state.token } auth={ this.state.auth } roomname={ this.state.roomname }/>
          </div>
          <ViewAllMessages sortBy={ this.state.sort } messages={ this.state.messages } sessions={ this.state.sessions }token={ this.state.token } auth={ this.state.auth } roomname={this.state.roomname}/>
        </div>
      </div>
    )
  },
  styles: {
    filter: {
      paddingTop: '80px',
      width: '100%',
      textAlign: 'center'
    },
    inputBox: {
      marginTop: '200px'
    }
  }
})

// React.render()

var routes = (
  React.createElement(Route, {name: 'app', path : '/', handler: App},
    React.createElement(DefaultRoute, {name: "index", handler: Home}),
    React.createElement(Route, {name: "room", path: "r/:roomname", handler: mainView})
  )
);

ReactRouter.run(routes, function (Handler) {
  React.render(<Handler/>, document.querySelector('.container'))
})

// var element = React.createElement(mainView);
// React.render(element, document.querySelector('.container'));
