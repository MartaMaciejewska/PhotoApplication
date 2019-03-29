import React, { Component } from 'react';
import {HashRouter, Route, Link,} from 'react-router-dom';
import Unsplash , {toJson} from 'unsplash-js';


const unsplash = new Unsplash({
    applicationId: "2c007a8dff36533a70b7ec1d0870a180dc5b0975b6876434ecdd782b3cf700ed",
    secret: "f97a2688cfa708b0504ecb2af95627ed38b5f6e55857e0f7dd8eb66b2275e06a"
  });



class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            collectionsArr:[],
            selectedCollection:"",
        }
        
    }

    getCollections() {
        let promise = unsplash.collections.listCollections(1, 10, "latest")
            .then(toJson)
            .then((response) => {
                response.map((value)=>{
                    unsplash.collections.getCollectionPhotos(value.id)
                    .then(toJson)
                    .then((response2)=>{

                        let photos =[];
                        response2.map((photo)=>{
                            photos.push(photo.urls.thumb);
                        }) 

                        this.setState(prevState=>({
                            collectionsArr: [...prevState.collectionsArr, {title: value.title, id: value.id, photos: photos}]
                        }))                    
                    })
                })
        });

        return promise;
    }

    async componentDidMount(){
       await this.getCollections();
       
        
    }

    render() {
         return (<HashRouter>
             <ul>
                {
                    this.state.collectionsArr.map((item)=>{
                        return(
                            <li className="sectionItem" key={item.id}>
                                <Link to={{
                                    pathname:`/${item.id}`, 
                                    state:{
                                        sectionName: `${item.title}`
                                    }
                                }}>
                                <div>
                                    <h1>{item.title}</h1>
                                    <div>
                                        <ul className="thumbs"> {
                                                item.photos.map((photo)=>{
                                                    return (
                                                    <li key={photo.id}><img src={photo}/></li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                </Link>
                            </li>
                        )
                    })
                }
             </ul>
         </HashRouter>
        )
    } 
    } 

    export default Main;
