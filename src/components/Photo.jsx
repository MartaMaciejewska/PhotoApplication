import React, { Component } from 'react';
import Unsplash , {toJson} from 'unsplash-js';
import { FacebookShareButton,FacebookIcon,} from 'react-share';

const unsplash = new Unsplash({
    applicationId: "2c007a8dff36533a70b7ec1d0870a180dc5b0975b6876434ecdd782b3cf700ed",
    secret: "f97a2688cfa708b0504ecb2af95627ed38b5f6e55857e0f7dd8eb66b2275e06a"
  });

class Photo extends Component{
    constructor(props){
        super(props);
        this.state={
            photoId:this.props.photoId,
            photoUrl:"",
            photoStats:[],
        }
    }
    getPhoto = () =>{
       let promise = unsplash.photos.getPhoto(this.state.photoId)
            .then(toJson)
            .then((response)=>{
                if(!(response.errors !== undefined && response.errors.length > 0)){
                    this.setState({
                        photoUrl: response.urls.regular
                    });
                }
            })

            return promise;
    }

    getStats = () =>{
    let promise = unsplash.photos.getPhotoStats(this.state.photoId)
       .then(toJson)
       .then((response) => {
            console.log(response)
        })

        return promise;
    }

    async componentDidMount(){
        await this.getPhoto();
        await this.getStats();
    }
    render(){
        return(
            <div className="bigPhotoContainer">
                <div><img src={this.state.photoUrl}/></div>
                <button onClick={this.props.handleSmall}>Go back</button>
                <span>Share it on </span><FacebookShareButton url={this.state.photoUrl}><FacebookIcon size={32} round={false}></FacebookIcon></FacebookShareButton> 
            </div>
        )
    }
}

export default Photo;
