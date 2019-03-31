import React, { Component } from 'react';
import {HashRouter} from 'react-router-dom';
import Unsplash , {toJson} from 'unsplash-js';
import Photo from './Photo.jsx';



const unsplash = new Unsplash({
    applicationId: "2c007a8dff36533a70b7ec1d0870a180dc5b0975b6876434ecdd782b3cf700ed",
    secret: "f97a2688cfa708b0504ecb2af95627ed38b5f6e55857e0f7dd8eb66b2275e06a"
  });


class Section extends Component {
    constructor(props){
    super(props);
    this.state={
        sectionId: this.props.match.params.section,
        sort:"latest",
        photosLatest:[],
        photosPopular:[],
        enlarge: false,
        chosenPhotoId:"",
        chosenPhotoLikes:"",
        chosenPhotoDwnlds:"",
        chosenPhotoCountry:"",
         }

    }

    handleSortPop=()=>{
        this.setState({
            sort:"popular"
        })

    }
    handleSortLate=()=>{
        this.setState({
            sort:"latest"
        })
    }

    getCollectionPhotos=(id)=>{
        let that = this;
        let promise = unsplash.collections.getCollectionPhotos(id, 1, 100, "latest")
             .then(toJson)
             .then((response) => {
                 response.map((photo)=>{
                    let url = photo.urls.small;
                    that.setState(prevState=>({photosLatest: [...prevState.photosLatest,{id: photo.id, url: url}]}))
                 })
              })
              let promise2 = unsplash.collections.getCollectionPhotos(id, 1, 100, "popular")
             .then(toJson)
             .then((response) => {
                response.map((photo)=>{
                 let url = photo.urls.small;
                 that.setState(prevState=>({photosPopular: [...prevState.photosPopular,{id: photo.id, url: url}]}))
                 })
              })
       return (promise, promise2);       
      }
    
     getPhotoStats=(id)=>{

        let promise = unsplash.photos.getPhotoStats(id)
            .then(toJson)
            .then((stats)=>{
                this.setState({
                    chosenPhotoDwnlds: stats.downloads,
                    chosenPhotoLikes: stats.likes
                })
            })
        return promise;
      }

      getPhotoCountry=(id)=>{
        let promise = unsplash.photos.getPhoto(id)
        .then(toJson)
        .then((response)=>{
            console.log(response)
            if(response.location ===undefined){
                this.setState({
                    chosenPhotoCountry: "",
                })
            } else {
            this.setState({
                chosenPhotoCountry: response.location.country,
            })
        }
        
        })

        return promise;
      }

      handleBig=(id)=>{
          this.setState({
              enlarge: true,
              chosenPhotoId:id,
          })

      }
      handleSmall = () =>{
        this.setState({
            enlarge: false, 
        })
      }

    async componentDidMount(){
    
    await this.getCollectionPhotos(this.state.sectionId);
    
    }
    

render(){

      return <HashRouter>
            <>
            
             {this.state.enlarge ? <Photo photoId={this.state.chosenPhotoId} handleSmall={this.handleSmall}/> :
            <div className="section">
                <div className="sectionHeader">
                    <h1></h1>
                    <button className="popBtn" onClick={this.handleSortPop}>MOST POPULAR</button>
                    <button className="lateBtn" onClick={this.handleSortLate}>LATEST</button>
                </div>
             <div className="photosContainer">
                {  this.state.sort==="latest" ?
                    this.state.photosLatest.map((photo)=>{
                    return(
                     <div className="regularPhoto" 
                          style={{backgroundImage:`url(${photo.url}`}}
                            photo={photo.id} 
                            onMouseEnter={()=>(this.getPhotoStats(photo.id), this.getPhotoCountry(photo.id))} 
                            onClick={()=>this.handleBig(photo.id)}>
                                <div className="infoContainer">
                                    <p>Likes: {this.state.chosenPhotoLikes}</p>
                                    <p>Downloads: {this.state.chosenPhotoDwnlds}</p>
                                     {this.state.chosenPhotoCountry!=="" && <p>Country: {this.state.chosenPhotoCountry}</p> }
                                </div>
                    </div>
                     )
                 })
                 :  this.state.photosPopular.map((photo)=>{
                    return(
                        <div className="regularPhoto" 
                        style={{backgroundImage:`url(${photo.url}`}}
                          photo={photo.id} 
                          onMouseEnter={()=>(this.getPhotoStats(photo.id), this.getPhotoCountry(photo.id))} 
                          onClick={()=>this.handleBig(photo.id)}>
                              <div className="infoContainer">
                                  <p>Likes: {this.state.chosenPhotoLikes}</p>
                                  <p>Downloads: {this.state.chosenPhotoDwnlds}</p>
                                  {this.state.chosenPhotoCountry!=="" && <p>Country: {this.state.chosenPhotoCountry}</p> }
                              </div>
                  </div>
                    )
                })
             }
            </div>
            </div>
           
             }
             </>
            
             </HashRouter>
    }
}

export default Section;
