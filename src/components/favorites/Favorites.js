import React, { Component } from "react"
import UserManager from "../../modules/UserManager"
import { Card, CardTitle, CardText, CardImg, CardGroup, CardBody, Button } from 'reactstrap';
import burger from "../../img/burger.png"
import hotdog from "../../img/hotdog.png"
import Ratings from "react-ratings-declarative"
import Masonry from "react-masonry-component"

const masonryOptions = {
    transitionDuration: 0
};

const imagesLoadedOptions = { background: '.my-bg-image-el' }
export default class Favorites extends Component {
    state = {
        favorites: [],
        isHidden: true
    }
    toggleHidden() {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }
    editSaveButton = (favorite) => { return (favorite.notes === "") ? "New Note" : "Edit Note" }

    deleteFavorite = (id) => {
        UserManager.deleteFavorite(id)
            .then(() => UserManager.getUserFavorites(this.props.activeUser)
                .then((favorites) => {
                    this.setState({
                        favorites: favorites
                    })
                }))
    }

    componentDidMount() {
        UserManager.getUserFavorites(this.props.activeUser).then((favorites) => {
            this.setState({
                favorites: favorites
            })
        })
    }


    render() {
        return (
            <React.Fragment>
                <div className="favBg" style={{ overflowY: "scroll" }}>
                    {/* <CardGroup className="favorites" style={{ margin: 20, justifyContent: "center", alignItems: "flex-start" }}> */}
                    <Masonry
                className={'my-gallery-class'} // default ''
                elementType={'ul'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                imagesLoadedOptions={imagesLoadedOptions} // default {}
            >
                        {
                            this.state.favorites.map(favorite =>
                                <Card key={favorite.restaurantId} id={favorite.id} style={{ maxWidth: 350, minWidth: 350, margin: 5, padding: "5px" }}>
                                    <CardImg width="100%" src={favorite.image} onClick={this.toggleHidden.bind(this)} />
                                    <div>
                                        {!this.state.isHidden &&
                                            <CardBody>
                                                <CardTitle style={{ marginBottom: 0 }}><p className="favoritesName">{favorite.name}</p></CardTitle>
                                                <CardText style={{ textAlign: "center" }}>
                                                    {favorite.category.map(category =>
                                                        <small className="text-muted" style={{ textAlign: "center", marginBottom: 0 }}><i>{category.title}&nbsp;</i></small>
                                                    )}
                                                </CardText>
                                                <CardText className="text-muted" style={{ textAlign: "center", marginTop: 0 }}>{favorite.price}</CardText>
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
                                                <CardText style={{ marginBottom: "0px", textAlign: "center" }}><strong>My rating:</strong></CardText>
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
                                                <CardText>{favorite.location.address1}<br />
                                                    {favorite.location.city}, {favorite.location.state} {favorite.location.zip_code}</CardText>
                                                <CardText><strong>Phone: </strong>{favorite.phone}</CardText>
                                                <CardText><strong>Website: </strong><a href={favorite.url} target="_blank" rel="noopener noreferrer">{favorite.name}</a></CardText>
                                                <div className="favNotes">
                                                    <CardText style={{ marginBottom: 0 }}><strong>Notes:</strong></CardText>
                                                    <CardText>{favorite.notes}</CardText>
                                                </div>
                                                <div className="favButtonContainer">
                                                    <Button
                                                        color="primary"
                                                        style={{ marginRight: 10 }}
                                                        onClick={() => this.props.history.push(`/favorites/${favorite.id}/edit`)}
                                                    ><i class="far fa-edit"></i></Button>
                                                    <Button color="danger" onClick={() => this.deleteFavorite(favorite.id)}><i class="far fa-trash-alt"></i></Button>
                                                </div>
                                            </CardBody>
                                        }
                                        </div>
                                </Card>
                            )
                        }
                        </Masonry>
                    {/* </CardGroup> */}
                    <img src={burger} className="favBurger" alt="burger" style={{ filter: "invert(100%)", width: "150px" }} />
                    <img src={hotdog} className="favHotdog" alt="hotdog" style={{ filter: "invert(100%)", width: "150px" }} />
                </div>
            </React.Fragment>
        )
    }
}