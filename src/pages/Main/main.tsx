import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import FullView from "../../components/FullView/fullView";

import searchIcon from "../../assets/search.svg";
import loadingGif from "../../assets/loading.gif";
import "./main.sass";
import { photoI, searchedPhotoI } from "../../types/types";

const API_KEY = "3CO7LQu_gxBaUrvM4lNBUE5feSlSgHxaogdMAcszN6E";

const getPhotos = async (value: string, pageLink: any, queryClient: any, loadMore: boolean, setTotalCached: any, pageRef: any) => {
    console.log("value", value);
    const existingData = queryClient.getQueryData([value]);
    console.log("0 existingData", existingData);
    if (existingData !== undefined && loadMore === false){
        console.log("existingData detected");
        console.log("0 length", existingData.length)
        setTotalCached(existingData.length)
        pageRef.current = (existingData.length/30).toFixed();
        return existingData;
    }

    return await axios(pageLink.current)
    .then((res: any) => {
        let result;
        if(value === "popular"){
            result = res.data;
        }
        else{
            result = res.data.results;
        }

        console.log("load", loadMore);
        if(loadMore){
            console.log("append to cache");
            let out = [...existingData, ...result];
            setTotalCached(out.length);
            console.log("1 length", out.length);
            queryClient.setQueryData([value], out);
            return out;
        }

        console.log("not append to cache");
        setTotalCached(result.length);
        console.log("2 length", result.length);
        return result;
    });
}

const MainPage = () => {
    const clickHandlerFullDisplay = (id: string) => {
        axios(`https://api.unsplash.com/photos/${id}?client_id=${API_KEY}`)
        .then((res: any) => {
            let newM: searchedPhotoI = { status: true, src: res.data.urls.regular, id, likes: res.data.likes, downloads: res.data.downloads, views: res.data.views };
            console.log(newM);
            setShowFullPicture(newM);
        })
        .catch((err: any) => console.error(err));
    }
    const returnHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key == "Enter"){
            let value: string = (e.target as HTMLInputElement).value;
            if (value == ""){
                return;
            }
            console.log(`enter00 ${value}`);
            pageRef.current = 1;
            pageLink.current = `https://api.unsplash.com/search/photos?client_id=${API_KEY}&query=${value}&per_page=30&page=${pageRef.current}`;
            setSearchWord(value);
        }
    }

    const pageRef = useRef(1);
    const pageLink = useRef(`https://api.unsplash.com/photos?client_id=${API_KEY}&order_by=popular&per_page=30&page=${pageRef.current}`);
    const [totalCached, setTotalCached] = useState<number>(30);

    const queryClient = useQueryClient();
    const [searchWord, setSearchWord] = useState<string>("popular");
    const { data, isLoading } = useQuery({
        queryKey: [searchWord],
        queryFn: () => getPhotos(searchWord, pageLink, queryClient, false, setTotalCached, pageRef),
        refetchOnWindowFocus: false,
        // cacheTime: Infinity,
        keepPreviousData: true,
    });

    const [loadedN, setLoadedN] = useState<number>(18);
    const [loading, setLoading] = useState<boolean>(false);
    const [showFullPicture, setShowFullPicture] = useState<searchedPhotoI>({ status: false, src: null, id: null, likes: 0, downloads: 0, views: 0 });

    const [bottomVisible, setBottomVisible] = useState<boolean>(false);
    const bottomRef = useRef<any>();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            setBottomVisible(entry.isIntersecting);
        });
        observer.observe(bottomRef.current);
    }, []);

    useEffect(() => {
        if (bottomVisible && !loading && ((loadedN%30) <= 28 || loadedN < totalCached)){
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setLoadedN(ln => ln+2);
            }, 600);
        }
        else if (loadedN >= totalCached){
            // setLoadedN(ln => ln+2);
            pageRef.current += 1;
            if (searchWord == "popular"){
                pageLink.current = `https://api.unsplash.com/photos?client_id=${API_KEY}&order_by=popular&per_page=30&page=${pageRef.current}`;
            }
            else{
                pageLink.current = `https://api.unsplash.com/search/photos?client_id=${API_KEY}&query=${searchWord}&per_page=30&page=${pageRef.current}`;
            }
            getPhotos(searchWord, pageLink, queryClient, true, setTotalCached, pageRef);
        }
    }, [bottomVisible]);

    return (
    <>
    {showFullPicture.status && <FullView showFullPicture={showFullPicture} setShowFullPicture={setShowFullPicture} />}

    <main className={`${showFullPicture.status && "hidden"}`}>
        <nav className="navigation">
            <ul>
                <li><Link to="/">მთავარი</Link></li>
                <li><Link to="/history">ისტორია</Link></li>
            </ul>
        </nav>
        <div className="search">
            <img className="icon" src={searchIcon} alt="search" />
            <input type="text" placeholder="მოძებნეთ სასურველი სურათი" onKeyDown={(event) => returnHandler(event)}/>
        </div>
        { searchWord === "popular" ? <h1 className="title">ყველაზე პოპულარული სურათები</h1> : <h1 className="title">ძებნა: {searchWord}</h1>}
        <div className="photo-wrapper">
            {data?.map((img: photoI, index: number) => {
                if(index >= loadedN){
                    return;
                }
                return (
                    <div key={img.id} className="photo">
                        <img src={img.urls.small} alt="img" onClick={() => clickHandlerFullDisplay(img.id)} />
                    </div>
                );
            })}
        </div>
        {(isLoading || loading) && <img src={loadingGif} className="loading" />}
        <div className="bottom" ref={bottomRef}>
        </div>
    </main>
    </>
  );
}

export default MainPage;