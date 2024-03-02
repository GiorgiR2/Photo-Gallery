import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import FullView from "../../components/FullView/fullView";

import backToMain from "../../assets/back.svg";
import loadingGif from "../../assets/loading.gif";

import "./history.sass";
import { photoI, searchedPhotoI } from "../../types/types";

const API_KEY = "3CO7LQu_gxBaUrvM4lNBUE5feSlSgHxaogdMAcszN6E";

const HistoryPage = () => {
    const clickHandlerFullDisplay = (id: string) => {
        axios(`https://api.unsplash.com/photos/${id}?client_id=${API_KEY}`)
        .then((res: any) => {
            let newM: searchedPhotoI = { status: true, src: res.data.urls.regular, id, likes: res.data.likes, downloads: res.data.downloads, views: res.data.views };
            console.log(newM);
            setShowFullPicture(newM);
        })
        .catch((err: any) => console.error(err));
    }
    const clickHandlerCategory = (results: any) => {
        setTotalCached(results.length);
        setData(results);
    }

    const queryClient = useQueryClient();
    const allQueries = queryClient.getQueryCache().findAll();
    
    const [data, setData] = useState<photoI[]>();
    const [loadedN, setLoadedN] = useState<number>(20);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCached, setTotalCached] = useState<number>(0);
    const [showFullPicture, setShowFullPicture] = useState<searchedPhotoI>({ status: false, src: null, id: null, likes: 0, downloads: 0, views: 0 });

    const [bottomVisible, setBottomVisible] = useState(false);
    const bottomRef = useRef<any>();

    useEffect(() => {
        // console.log("allCached", allQueries);
        // allQueries.forEach((query: any) => {
        //     const { queryKey, state } = query;
        //     console.log("queryKey", queryKey);
        //     console.log("state", state.data);
        // })

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            setBottomVisible(entry.isIntersecting);
        });
        observer.observe(bottomRef.current);
    }, []);

    useEffect(() => {
        if (bottomVisible && loadedN < totalCached){
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setLoadedN(ln => ln+2);
            }, 200);
        }
    }, [bottomVisible]);

    return (
        <>
        {showFullPicture.status && <FullView showFullPicture={showFullPicture} setShowFullPicture={setShowFullPicture} />}
        <main className={`${showFullPicture.status && "hidden"}`}>
            <div className="top">
                <Link to="/">
                    <img className="back" src={backToMain} alt="search" />
                </Link>
                <h1 className="title">სურათების ისტორია</h1>
            </div>
            <div className="hist">
                {
                allQueries.map((query: any) => {
                    const { queryKey, state } = query;
                    if(queryKey === ""){
                        return;
                    }
                    return <h2 key={queryKey} onClick={() => clickHandlerCategory(state.data)}>{queryKey}</h2>;
                })
                }
            </div>

            <div className="photo-wrapper">
                {data ?
                data.map((img: photoI, index: number) => {
                    if(index > loadedN){
                        return;
                    }
                    return (
                        <div key={img.id} className="photo">
                            <img src={img.urls.small} alt="img" onClick={() => clickHandlerFullDisplay(img.id)}/>
                        </div>
                    );
                })
                :
                <h1>Category Not Selected</h1>
                }
            </div>
            {loading && <img src={loadingGif} className="loading" />}
            <div className="bottom" ref={bottomRef}>
            </div>
        </main>
        </>
    );
}

export default HistoryPage;