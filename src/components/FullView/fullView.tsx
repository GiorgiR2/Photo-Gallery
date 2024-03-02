import React from "react";

import likesIcon from "../../assets/likes.svg";
import viewsIcon from "../../assets/views.svg";
import downloadsIcon from "../../assets/downloads.svg";

import "./fullView.sass"

const FullView = ({ showFullPicture, setShowFullPicture }: { showFullPicture: any, setShowFullPicture: any}) => {
    const exitHandler = () => {
        setShowFullPicture({status: false});
    }
    return(

    <div className="full-view">
        <h2 className="exit" onClick={exitHandler}>X</h2>
        <div className="center">
            <img className="main-image" src={showFullPicture.src} alt="img"/>
            <div className="wrapper">
                <div className="svg">
                    <img className="icon" src={likesIcon} alt="search" />
                    <h2>{showFullPicture.likes}</h2>
                </div>
                <div className="svg">
                    <img className="icon" src={downloadsIcon} alt="search" />
                    <h2>{showFullPicture.downloads}</h2>
                </div>
                <div className="svg">
                    <img className="icon" src={viewsIcon} alt="search" />
                    <h2>{showFullPicture.views}</h2>
                </div>
            </div>
        </div>
    </div>

    );
}

export default FullView;