import React, { Component } from 'react';
import Unsplash , {toJson} from 'unsplash-js';
import { FacebookShareButton,FacebookIcon} from 'react-share';
import { SocialIcon } from 'react-social-icons';

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
            user:"",
            userPhoto:"",

            
        }
    }
    getPhoto = () =>{
       let promise = unsplash.photos.getPhoto(this.state.photoId)
            .then(toJson)
            .then((response)=>{
                if(!(response.errors !== undefined && response.errors.length > 0)){
                    console.log(response)
                    this.setState({
                        photoUrl: response.urls.regular,
                        camera: response.exif.model,
                        user: response.user.name,
                        userPhoto: response.user.profile_image.large,
                        instaUrl: response.user.portfolio_url,

                    });
                    if(response.story.description!==undefined || response.story.description!==null){
                        this.setState({
                        description: response.story.description,
                        })
                    }
                    
                }
            })

        return promise;
    }

    async componentDidMount(){
        await this.getPhoto();
    }
    render(){
        return(
            <div className="bigPhotoContainer">
                <div className="actionsContainer">
                <button onClick={this.props.handleSmall}>GO BACK</button>
                
                    <div className="infoContainer">
                        <p>{this.state.desciption}</p>
                        <p>Created by <strong>{this.state.user}</strong></p>
                        <img src={this.state.userPhoto}></img>
                       {this.state.camera!==null && <p>Shot with <strong>{this.state.camera}</strong></p>}
                        <p>Check out more by the same artist</p>
                        <SocialIcon network="instagram" style={{ height: 50, width: 50 }} url={this.state.instaUrl}></SocialIcon>

                        

                    </div>
                    <div className="fbContainer">
                        <span>SHARE IT ON </span>
                        <FacebookShareButton url={this.state.photoUrl}>
                        <FacebookIcon size={64}></FacebookIcon>
                        </FacebookShareButton> 
                    </div>
                 </div>
                 <img src={this.state.photoUrl}/> 
            </div>
        )
    }
}

export default Photo;
