import React, { Component } from 'react';
import {HashRouter} from 'react-router-dom';
import Unsplash , {toJson} from 'unsplash-js';
import Photo from './Photo.jsx';
import InfiniteScroll from 'react-infinite-scroll-component'



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
        counter: 1,
        perPage:30,
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
        const { counter, perPage } = this.state
        let that = this;
        let promise = unsplash.collections.getCollectionPhotos(id, `${counter}`, `${perPage}` , "latest")
             .then(toJson)
             .then((response) => {
                 response.map((photo)=>{
                    let url = photo.urls.small;
                    that.setState(prevState=>({photosLatest: [...prevState.photosLatest,{id: photo.id, url: url}]}))
                 })
              })
              let promise2 = unsplash.collections.getCollectionPhotos(id,`${counter}`, `${perPage}`, "popular")
             .then(toJson)
             .then((response) => {
                response.map((photo)=>{
                 let url = photo.urls.small;
                 that.setState(prevState=>({photosPopular: [...prevState.photosPopular,{id: photo.id, url: url}]}))
                 })
              })
       return (promise, promise2);       
      }

      getMorePhotos=(id)=>{
        let that = this;
        const { counter, perPage } = this.state;
        this.setState({
            perPage: this.state.perPage + counter,
        })
        let promise = unsplash.collections.getCollectionPhotos(id,`${counter}`, `${perPage}`, "latest")
             .then(toJson)
             .then((response) => {
                 response.map((photo)=>{
                    let url = photo.urls.small;
                    that.setState(prevState=>({photosLatest: [...prevState.photosLatest,{id: photo.id, url: url}]}))
                 })
              })
              let promise2 = unsplash.collections.getCollectionPhotos(id,`${counter}`, `${perPage}`, "popular")
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
          this.setState({
              chosenPhotoCountry:""
          })
        let promise = unsplash.photos.getPhoto(id)
        .then(toJson)
        .then((response)=>{
            console.log(response)
            if(response.location !==undefined){
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
                             <InfiniteScroll dataLength={this.state.photosLatest.length}
                             next={this.getMorePhotos}
                             hasMore={true}
                             loader={<h4>Wait a sec...</h4>}
                             endMessage={
                                <p style={{textAlign: 'center'}}>
                                <strong>You have seen it all</strong>
                             </p> }>
        
                    {this.state.photosLatest.map((photo)=>{
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
                 })}
                 </InfiniteScroll>
             
                 :  
                 <InfiniteScroll dataLength={this.state.photosPopular.length}
                 next={this.getMorePhotos}
                 hasMore={true}
                 loader={<h4>Wait a sec...</h4>}
                 endMessage={
                    <p style={{textAlign: 'center'}}>
                    <strong>You have seen it all</strong>
                 </p> }>
                 {this.state.photosPopular.map((photo)=>{
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
                })}
                </InfiniteScroll>
             }
             
             
            </div>
            </div>
           
             }
             </>
            
             </HashRouter>
    }
}

export default Section;
