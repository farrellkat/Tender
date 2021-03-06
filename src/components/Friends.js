import React, { Component } from "react"
import UserManager from "../modules/UserManager"
import { Card, CardTitle, CardText, CardImg, CardBody, Button, CardSubtitle, Form, FormGroup, Input, Col, Row } from 'reactstrap';
import Ratings from "react-ratings-declarative"
import Masonry from "react-masonry-component"
import Switch from "react-switch";

const masonryOptions = {
    transitionDuration: '0.8s',
    fitWidth: true
};

const imagesLoadedOptions = { background: '.my-bg-image-el' }
export default class Favorites extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        favorites: [],
        friends: [],
        checked: false,
        search: ""
    }
    favArray = []

    handleChange(checked) {
        this.setState({ checked });
    }

    loadFriends = () => {
        this.setState({
            favorites: [],
            friends: []
        })
        UserManager.getAllFriends(this.props.activeUser)
            .then((friends) => this.setState({
                friends: friends
            }))
            .then(() => UserManager.getAllFavorites())
            .then((favorites) => {
                const friendId = this.state.friends.map((friend) => friend.fId)
                friendId.map((id) =>
                    (favorites.filter((favorite) => id === favorite.userId).map((favorite) => this.favArray.push(favorite))))
                this.setState({ favorites: this.favArray })
            })
    }

    componentDidMount() {
        console.log(this.props.activeUser)
        this.loadFriends()
    }

    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };

    searchAllFavorites = (search) => {
        this.favArray = []
        UserManager.searchAllFavorites(search)
            .then((favorites) => {
                const friendId = this.state.friends.map((friend) => friend.fId)
                friendId.map((id) =>
                    (favorites.filter((favorite) => id === favorite.userId).map((favorite) => this.favArray.push(favorite))))
                this.setState({ favorites: this.favArray })
            })
    }

    render() {
        return (
            // this.state.favorites.length ?
            <React.Fragment>
                <div className="friendsBg" style={{ overflowY: "scroll" }}>
                    <div className="stickyHeader">
                        <h1 className="stickyPageHeader">Friends</h1>
                        <div className="searchContainer">
                            <Form className="searchInput">
                                <Col>
                                    <Row style={{justifyContent:"center"}}>
                                        <FormGroup>
                                            <Input type="text"
                                                name="search"
                                                id="search"
                                                onChange={this.handleFieldChange}
                                                style={{ marginRight: "5px" }} />
                                        </FormGroup>
                                        <FormGroup style={{marginLeft:"5px"}}>
                                            <Button
                                                color="info"
                                                onClick={() => this.searchAllFavorites(this.state.search)}
                                            >Search</Button>
                                            <Button
                                                outline color="warning"
                                                onClick={() => UserManager.getAllFavorites()
                                                    .then((favorites) => {
                                                        this.favArray = []
                                                        const friendId = this.state.friends.map((friend) => friend.fId)
                                                        friendId.map((id) =>
                                                            (favorites.filter((favorite) => id === favorite.userId).map((favorite) => this.favArray.push(favorite))))
                                                        this.setState({ favorites: this.favArray })
                                                    })}
                                                style={{ marginLeft: "5px" }}
                                            >Show all</Button>
                                        </FormGroup>
                                    </Row>
                                </Col>
                            </Form>
                        </div>
                        <Form className="infoSwitch">
                            <span style={{ marginRight: "10px" }}>{`${(this.state.checked) ? `Hide details` : `Show details`}`}</span>
                            <Switch
                                onChange={this.handleChange}
                                checked={this.state.checked}
                                onColor="#FF5A5A" />
                        </Form>
                    </div>
                    <Masonry
                        className={'my-gallery-class'} // default ''
                        elementType={'ul'} // default 'div'
                        options={masonryOptions} // default {}
                        disableImagesLoaded={false} // default false
                        updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                        imagesLoadedOptions={imagesLoadedOptions} // default {}
                        style={{ top: "60px" }}
                    >
                        {
                            this.state.favorites.map(favorite =>
                                <Card key={favorite.restaurantId} id={favorite.id} style={{ maxWidth: 350, minWidth: 350, margin: 5, padding: "5px" }}>
                                    <CardImg
                                        width="100%"
                                        src={favorite.image}
                                    />
                                    <div>
                                        {this.state.checked &&
                                            <CardBody>
                                                <CardTitle style={{ marginBottom: 0 }}><p className="favoritesName">{favorite.name}</p></CardTitle>
                                                <CardText style={{ textAlign: "center" }}>
                                                    {favorite.category.map(category =>
                                                        <small className="text-muted" style={{ textAlign: "center", marginBottom: 0 }}><i>{category.title}&nbsp;</i></small>
                                                    )}
                                                </CardText>
                                                <CardText className="text-muted" style={{ textAlign: "center", marginTop: 0 }}>{favorite.price}</CardText>
                                                <CardSubtitle color="info" style={{ marginBottom: 10, textAlign: "center" }}>{favorite.user.firstName} {favorite.user.lastName} liked this!</CardSubtitle>
                                                <CardText style={{ marginBottom: "0px", textAlign: "center" }}><strong>Yelp rating:</strong></CardText>
                                                <div className="favoritePageRatings">
                                                    <Ratings
                                                        rating={favorite.yelpRating}
                                                        widgetDimensions="30px"
                                                        widgetSpacings="5px"
                                                        widgetRatedColors="darkred"
                                                    >
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                    </Ratings>
                                                </div>
                                                <CardText style={{ marginBottom: "0px", textAlign: "center" }}><strong>{favorite.user.firstName}'s rating:</strong></CardText>
                                                <div className="favoritePageRatings">
                                                    <Ratings
                                                        rating={favorite.rating}
                                                        widgetDimensions="30px"
                                                        widgetSpacings="5px"
                                                        widgetRatedColors="goldenrod"
                                                    >
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                        <Ratings.Widget />
                                                    </Ratings>
                                                </div>
                                                <CardText style={{ marginBottom: 0 }}><strong>Address:</strong></CardText>
                                                <CardText><a target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=
                                                ${favorite.location.address1} ${favorite.location.city}, ${favorite.location.state} ${favorite.location.zip_code}`}
                                                >{favorite.location.address1}
                                                    <br />
                                                    {favorite.location.city}, {favorite.location.state} {favorite.location.zip_code}
                                                </a>
                                                </CardText>
                                                <CardText><strong>Phone: </strong>{favorite.phone}</CardText>
                                                <CardText><strong>Website: </strong><a href={favorite.url} target="_blank" rel="noopener noreferrer">{favorite.name}</a></CardText>
                                                <div className="favNotes">
                                                    <CardText style={{ marginBottom: 0 }}><strong>Notes:</strong></CardText>
                                                    <CardText>{favorite.notes}</CardText>
                                                </div>
                                                <div className="friendButtonContainer">
                                                    <Button
                                                        color="primary"
                                                        style={{ marginRight: 10 }}
                                                        onClick={() => this.props.history.push(`/favorites/${favorite.userId}/friendfavorite`)}
                                                    >See more of {favorite.user.firstName}'s favorites</Button>
                                                </div>
                                            </CardBody>
                                        }</div>
                                </Card>
                            )
                        }
                    </Masonry>
                </div>
            </React.Fragment>
        )
    }
}